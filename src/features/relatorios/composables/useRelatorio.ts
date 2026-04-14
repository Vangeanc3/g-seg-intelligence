import { ref, computed, watch } from 'vue'
import { crimesService } from '@/features/mapa-crimes/services/crimesService'
import type { CrimesGeoJson } from '@/features/mapa-crimes/types/crime'
import { CRIME_LABELS, CRIME_CORES } from '@/features/mapa-crimes/types/crime'
import type { RelatorioConfig, RelatorioEstatisticas } from '../types/relatorio'
import { useToast } from '@/shared/composables/useToast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

type JsPdfWithAutoTable = jsPDF & {
  lastAutoTable?: { finalY: number }
}

export function useRelatorio() {
  const toast = useToast()

  const config = ref<RelatorioConfig>({
    titulo: 'Relatório de Ocorrências — Belém/PA',
    dataInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
    dataFim: new Date().toISOString().split('T')[0]!,
    bairros: [],
    naturezas: [],
  })

  const dados = ref<CrimesGeoJson['features']>([])
  const carregando = ref(false)
  const relatorioGerado = ref(false)

  // Bairros disponíveis — hardcoded por enquanto (API só tem TERRA FIRME)
  const bairrosDisponiveis = ['TERRA FIRME']

  // Debounced busca quando filtros mudam
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  watch(
    () => [config.value.dataInicio, config.value.dataFim, config.value.bairros, config.value.naturezas],
    () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(buscarDados, 500)
    },
    { deep: true },
  )

  async function buscarDados() {
    carregando.value = true
    try {
      const geoJson = await crimesService.getGeoJson({
        dataInicio: config.value.dataInicio || undefined,
        dataFim: config.value.dataFim || undefined,
        bairro: config.value.bairros[0] || undefined,
        natureza: config.value.naturezas[0] || undefined,
      })

      // Filtros adicionais client-side se múltiplas seleções
      let filtrados = geoJson.features
      if (config.value.bairros.length > 1) {
        filtrados = filtrados.filter(f => config.value.bairros.includes(f.properties.bairro))
      }
      if (config.value.naturezas.length > 1) {
        filtrados = filtrados.filter(f => config.value.naturezas.includes(f.properties.natureza))
      }

      dados.value = filtrados
    } catch {
      toast.error('Erro ao buscar dados para o relatório')
      dados.value = []
    } finally {
      carregando.value = false
    }
  }

  // Busca inicial
  buscarDados()

  const totalFiltrado = computed(() => dados.value.length)

  async function gerarRelatorio() {
    await buscarDados()
    if (dados.value.length === 0) {
      toast.warning('Nenhuma ocorrência encontrada com os filtros selecionados')
      return
    }
    relatorioGerado.value = true
    toast.success('Relatório gerado com sucesso')
  }

  function voltar() {
    relatorioGerado.value = false
  }

  // ── Estatísticas ──────────────────────────────────────────────

  const estatisticas = computed<RelatorioEstatisticas>(() => {
    const total = dados.value.length
    const porBairro: Record<string, number> = {}
    const porNatureza: Record<string, number> = {}
    const contagemHora = new Array(24).fill(0) as number[]

    dados.value.forEach(f => {
      const p = f.properties
      porBairro[p.bairro] = (porBairro[p.bairro] || 0) + 1
      porNatureza[p.natureza] = (porNatureza[p.natureza] || 0) + 1
      if (p.horaFato) {
        const hora = parseInt(p.horaFato.split(':')[0]!, 10)
        if (!isNaN(hora)) {
          contagemHora[hora] = (contagemHora[hora] ?? 0) + 1
        }
      }
    })

    const topBairros = Object.entries(porBairro)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([bairro, qtd]) => ({ bairro, qtd }))

    const topNaturezas = Object.entries(porNatureza)
      .sort((a, b) => b[1] - a[1])
      .map(([natureza, qtd]) => ({
        natureza,
        label: CRIME_LABELS[natureza] ?? natureza,
        qtd,
        pct: total > 0 ? Math.round((qtd / total) * 100) : 0,
        cor: CRIME_CORES[natureza] ?? '#6b7280',
      }))

    // Período em dias
    const inicio = new Date(config.value.dataInicio)
    const fim = new Date(config.value.dataFim)
    const periodoDias = Math.max(1, Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))
    const mediaDiaria = Math.round((total / periodoDias) * 10) / 10

    // Horário de pico
    const pico = contagemHora.indexOf(Math.max(...contagemHora))
    const horarioPico = total > 0
      ? `${pico.toString().padStart(2, '0')}:00 - ${(pico + 1).toString().padStart(2, '0')}:00`
      : 'N/A'

    const bairroMaisPerigoso = topBairros[0]?.bairro ?? 'N/A'
    const tipoMaisFrequente = topNaturezas[0]
      ? topNaturezas[0].label
      : 'N/A'

    return {
      total,
      mediaDiaria,
      bairroMaisPerigoso,
      tipoMaisFrequente,
      horarioPico,
      periodoDias,
      topBairros,
      topNaturezas,
    }
  })

  // ── Exportar CSV ──────────────────────────────────────────────

  function exportarCsv() {
    if (dados.value.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    const headers = ['Natureza', 'Categoria', 'Data', 'Hora', 'Bairro', 'Meio Empregado', 'Sexo Vítima', 'Idade Vítima', 'Latitude', 'Longitude']
    const linhas = dados.value.map(f => {
      const p = f.properties
      const [lng, lat] = f.geometry.coordinates
      return [
        p.natureza,
        p.categoria || '',
        p.dataFato,
        p.horaFato || '',
        p.bairro,
        p.meioEmpregado || '',
        p.sexoVitima || '',
        p.idadeVitima?.toString() || '',
        lat!.toString(),
        lng!.toString(),
      ].map(v => `"${v.replace(/"/g, '""')}"`).join(';')
    })

    const csv = '\uFEFF' + [headers.join(';'), ...linhas].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `gseg-relatorio-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exportado com sucesso!')
  }

  // ── Exportar PDF ──────────────────────────────────────────────

  function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  function formatDatePdf(dateStr: string): string {
    if (!dateStr) return ''
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  function exportarPdf() {
    if (dados.value.length === 0) {
      toast.warning('Nenhum dado para exportar')
      return
    }

    const est = estatisticas.value
    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - margin * 2
    let y = margin

    // Cores
    const azul = [59, 130, 246] as [number, number, number]
    const cinzaEscuro = [30, 41, 59] as [number, number, number]
    const cinzaClaro = [148, 163, 184] as [number, number, number]
    const branco = [255, 255, 255] as [number, number, number]

    function checkPageBreak(needed: number) {
      if (y + needed > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        y = margin
      }
    }

    // ===== HEADER =====
    doc.setFillColor(...azul)
    doc.rect(0, 0, pageWidth, 40, 'F')

    doc.setTextColor(...branco)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('G-SEG Intelligence', margin, 16)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(config.value.titulo, margin, 24)

    doc.setFontSize(8)
    const periodoStr = `${formatDatePdf(config.value.dataInicio)} — ${formatDatePdf(config.value.dataFim)}`
    doc.text(periodoStr, margin, 32)
    doc.text('Belém/PA — Brasil', pageWidth - margin - doc.getTextWidth('Belém/PA — Brasil'), 32)

    y = 50

    // ===== RESUMO EM CARDS =====
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cinzaEscuro)
    doc.text('Resumo Geral', margin, y)
    y += 8

    const cardWidth = (contentWidth - 9) / 4
    const cards = [
      { label: 'Total de Ocorrências', valor: est.total.toString() },
      { label: 'Média Diária', valor: est.mediaDiaria.toString() },
      { label: 'Bairro Crítico', valor: est.bairroMaisPerigoso },
      { label: 'Horário de Pico', valor: est.horarioPico },
    ]

    cards.forEach((card, i) => {
      const x = margin + i * (cardWidth + 3)
      doc.setFillColor(245, 247, 250)
      doc.roundedRect(x, y, cardWidth, 22, 2, 2, 'F')
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cinzaClaro)
      doc.text(card.label.toUpperCase(), x + 4, y + 7)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cinzaEscuro)
      const valorTruncado = card.valor.length > 16 ? card.valor.slice(0, 15) + '…' : card.valor
      doc.text(valorTruncado, x + 4, y + 17)
    })

    y += 32

    // ===== DISTRIBUIÇÃO POR NATUREZA =====
    checkPageBreak(60)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cinzaEscuro)
    doc.text('Distribuição por Tipo de Crime', margin, y)
    y += 8

    const maxNat = Math.max(...est.topNaturezas.map(t => t.qtd), 1)
    est.topNaturezas.forEach(t => {
      checkPageBreak(10)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cinzaEscuro)
      doc.text(t.label, margin, y + 4)

      const barX = margin + 45
      const barMaxWidth = contentWidth - 80
      doc.setFillColor(230, 233, 240)
      doc.roundedRect(barX, y, barMaxWidth, 5, 1, 1, 'F')

      const barWidth = (t.qtd / maxNat) * barMaxWidth
      const cor = hexToRgb(t.cor)
      doc.setFillColor(cor[0], cor[1], cor[2])
      doc.roundedRect(barX, y, Math.max(barWidth, 2), 5, 1, 1, 'F')

      doc.setFontSize(7)
      doc.setTextColor(...cinzaClaro)
      doc.text(`${t.qtd} (${t.pct}%)`, barX + barMaxWidth + 3, y + 4)

      y += 9
    })

    y += 5

    // ===== TOP 10 BAIRROS =====
    checkPageBreak(40)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cinzaEscuro)
    doc.text('Top 10 Bairros com Mais Ocorrências', margin, y)
    y += 4

    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      head: [['#', 'Bairro', 'Ocorrências', '%']],
      body: est.topBairros.map((b, i) => [
        (i + 1).toString(),
        b.bairro,
        b.qtd.toString(),
        `${est.total > 0 ? Math.round((b.qtd / est.total) * 100) : 0}%`,
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: azul,
        textColor: branco,
        fontStyle: 'bold',
        fontSize: 8,
        cellPadding: 3,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 3,
        textColor: cinzaEscuro,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        2: { cellWidth: 30, halign: 'center' },
        3: { cellWidth: 20, halign: 'center' },
      },
    })

    const docWithTable = doc as JsPdfWithAutoTable
    y = (docWithTable.lastAutoTable?.finalY ?? y) + 10

    // ===== FOOTER =====
    const pageHeight = doc.internal.pageSize.getHeight()
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...cinzaClaro)
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      margin,
      pageHeight - 10,
    )
    doc.text(
      `G-SEG Intelligence © ${new Date().getFullYear()}`,
      pageWidth - margin - doc.getTextWidth(`G-SEG Intelligence © ${new Date().getFullYear()}`),
      pageHeight - 10,
    )

    // Download
    doc.save(`gseg-relatorio-${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('PDF exportado com sucesso!')
  }

  return {
    config,
    dados,
    totalFiltrado,
    estatisticas,
    carregando,
    relatorioGerado,
    bairrosDisponiveis,
    buscarDados,
    gerarRelatorio,
    voltar,
    exportarCsv,
    exportarPdf,
  }
}
