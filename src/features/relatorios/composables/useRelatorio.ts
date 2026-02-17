import { ref, computed } from 'vue'
import { crimesMock } from '@/features/mapa-crimes/services/crimeService'
import { CRIME_LABELS, CRIME_CORES } from '@/features/mapa-crimes/types/crime'
import type { TipoCrime } from '@/features/mapa-crimes/types/crime'
import type { RelatorioConfig, RelatorioResumo } from '../types/relatorio'
import jsPDF from 'jspdf'
// @ts-ignore - jspdf-autotable extends jsPDF prototype
import autoTable from 'jspdf-autotable'
import { useToast } from '@/shared/composables/useToast'

export function useRelatorio() {
  const crimes = crimesMock
  const toast = useToast()

  const config = ref<RelatorioConfig>({
    titulo: 'Relatório de Segurança',
    periodo: {
      inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
      fim: new Date().toISOString().split('T')[0]!,
    },
    bairros: [],
    tipos: [],
  })

  const gerado = ref(false)

  // Crimes filtrados pela config
  const crimesFiltrados = computed(() => {
    let resultado = [...crimes]

    if (config.value.periodo.inicio) {
      resultado = resultado.filter(c => c.data >= config.value.periodo.inicio)
    }
    if (config.value.periodo.fim) {
      resultado = resultado.filter(c => c.data <= config.value.periodo.fim + 'T23:59:59')
    }
    if (config.value.bairros.length > 0) {
      resultado = resultado.filter(c => config.value.bairros.includes(c.bairro))
    }
    if (config.value.tipos.length > 0) {
      resultado = resultado.filter(c => config.value.tipos.includes(c.tipo))
    }

    return resultado
  })

  // Resumo calculado
  const resumo = computed<RelatorioResumo>(() => {
    const lista = crimesFiltrados.value
    const total = lista.length

    // Período em dias
    const inicio = new Date(config.value.periodo.inicio)
    const fim = new Date(config.value.periodo.fim)
    const periodoDias = Math.max(1, Math.ceil((fim.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)))

    // Média diária
    const mediaDiaria = Math.round((total / periodoDias) * 10) / 10

    // Bairro mais perigoso
    const contagemBairro: Record<string, number> = {}
    lista.forEach(c => { contagemBairro[c.bairro] = (contagemBairro[c.bairro] || 0) + 1 })
    const bairroEntries = Object.entries(contagemBairro).sort((a, b) => b[1] - a[1])
    const bairroMaisPerigoso = bairroEntries.length > 0 ? bairroEntries[0]![0] : 'N/A'

    // Tipo mais frequente
    const contagemTipo: Record<string, number> = {}
    lista.forEach(c => { contagemTipo[c.tipo] = (contagemTipo[c.tipo] || 0) + 1 })
    const tipoEntries = Object.entries(contagemTipo).sort((a, b) => b[1] - a[1])
    const tipoMaisFrequente = tipoEntries.length > 0
      ? CRIME_LABELS[tipoEntries[0]![0] as keyof typeof CRIME_LABELS] || tipoEntries[0]![0]
      : 'N/A'

    // Horário de pico
    const contagemHora = new Array(24).fill(0)
    lista.forEach(c => { contagemHora[new Date(c.data).getHours()]++ })
    const pico = contagemHora.indexOf(Math.max(...contagemHora))
    const horarioPico = `${pico.toString().padStart(2, '0')}:00 - ${(pico + 1).toString().padStart(2, '0')}:00`

    // Por tipo
    const porTipo = Object.entries(contagemTipo)
      .map(([tipo, count]) => ({
        tipo,
        label: CRIME_LABELS[tipo as keyof typeof CRIME_LABELS] || tipo,
        total: count,
        cor: CRIME_CORES[tipo as keyof typeof CRIME_CORES] || '#6b7280',
        percentual: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)

    // Por bairro (top 10)
    const porBairro = bairroEntries
      .slice(0, 10)
      .map(([bairro, count]) => ({
        bairro,
        total: count,
        percentual: total > 0 ? Math.round((count / total) * 100) : 0,
      }))

    // Por status
    const contagemStatus: Record<string, number> = {}
    lista.forEach(c => { contagemStatus[c.status] = (contagemStatus[c.status] || 0) + 1 })
    const statusLabels: Record<string, string> = {
      aberto: 'Aberto',
      em_investigacao: 'Em Investigação',
      solucionado: 'Solucionado',
    }
    const statusCores: Record<string, string> = {
      aberto: '#ef4444',
      em_investigacao: '#f59e0b',
      solucionado: '#22c55e',
    }
    const porStatus = Object.entries(contagemStatus).map(([status, count]) => ({
      status,
      label: statusLabels[status] || status,
      total: count,
      cor: statusCores[status] || '#6b7280',
    }))

    return {
      totalCrimes: total,
      periodoDias,
      mediaDiaria,
      bairroMaisPerigoso,
      tipoMaisFrequente,
      horarioPico,
      porTipo,
      porBairro,
      porStatus,
    }
  })

  function gerarRelatorio() {
    gerado.value = true
    toast.info('Relatório gerado com sucesso!')
  }

  function voltarConfig() {
    gerado.value = false
  }

  function exportarCsv() {
    const lista = crimesFiltrados.value

    if (lista.length === 0) {
      toast.warning('Nenhuma ocorrência encontrada com os filtros atuais.')
      return
    }

    // Headers
    const headers = ['ID', 'Tipo', 'Bairro', 'Endereço', 'Data', 'Hora', 'Status', 'Latitude', 'Longitude', 'Descrição']

    // Rows
    const rows = lista.map(c => {
      const d = new Date(c.data)
      return [
        c.id,
        CRIME_LABELS[c.tipo as keyof typeof CRIME_LABELS] || c.tipo,
        c.bairro,
        `"${c.endereco.replace(/"/g, '""')}"`,
        d.toLocaleDateString('pt-BR'),
        d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        c.status === 'em_investigacao' ? 'Em Investigação' : c.status === 'solucionado' ? 'Solucionado' : 'Aberto',
        c.lat,
        c.lng,
        `"${(c.descricao || '').replace(/"/g, '""')}"`,
      ].join(',')
    })

    // BOM pra Excel reconhecer UTF-8
    const bom = '\uFEFF'
    const csv = bom + [headers.join(','), ...rows].join('\n')

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    // Nome do arquivo com data
    const hoje = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `gseg-relatorio-${hoje}.csv`
    link.click()
    URL.revokeObjectURL(url)

    toast.success('CSV exportado com sucesso!')
  }

  // Helper: converter hex pra RGB
  function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  // Helper: formatar data pro PDF
  function formatDatePdf(dateStr: string): string {
    if (!dateStr) return ''
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  function exportarPdf() {
    const lista = crimesFiltrados.value
    const r = resumo.value

    if (lista.length === 0) {
      toast.warning('Nenhuma ocorrência encontrada com os filtros atuais.')
      return
    }

    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 15
    const contentWidth = pageWidth - margin * 2
    let y = margin

    // --- Cores ---
    const azul = [59, 130, 246] as [number, number, number]
    const cinzaEscuro = [30, 41, 59] as [number, number, number]
    const cinzaClaro = [148, 163, 184] as [number, number, number]
    const branco = [255, 255, 255] as [number, number, number]

    // --- Helper ---
    function checkPageBreak(needed: number) {
      if (y + needed > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        y = margin
      }
    }

    // ===== HEADER =====
    // Fundo azul no header
    doc.setFillColor(...azul)
    doc.rect(0, 0, pageWidth, 40, 'F')

    // Título
    doc.setTextColor(...branco)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('G-SEG Intelligence', margin, 16)

    // Subtítulo
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(config.value.titulo, margin, 24)

    // Período
    doc.setFontSize(8)
    const periodoStr = `${formatDatePdf(config.value.periodo.inicio)} — ${formatDatePdf(config.value.periodo.fim)}`
    doc.text(periodoStr, margin, 32)

    // Localização
    doc.text('Belém/PA — Brasil', pageWidth - margin - doc.getTextWidth('Belém/PA — Brasil'), 32)

    y = 50

    // ===== RESUMO EM CARDS =====
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cinzaEscuro)
    doc.text('Resumo Geral', margin, y)
    y += 8

    const cardWidth = (contentWidth - 9) / 4 // 4 cards com 3px gap
    const cards = [
      { label: 'Total de Ocorrências', valor: r.totalCrimes.toString() },
      { label: 'Média Diária', valor: r.mediaDiaria.toString() },
      { label: 'Bairro Crítico', valor: r.bairroMaisPerigoso },
      { label: 'Horário de Pico', valor: r.horarioPico },
    ]

    cards.forEach((card, i) => {
      const x = margin + i * (cardWidth + 3)
      // Background do card
      doc.setFillColor(245, 247, 250)
      doc.roundedRect(x, y, cardWidth, 22, 2, 2, 'F')
      // Label
      doc.setFontSize(6.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cinzaClaro)
      doc.text(card.label.toUpperCase(), x + 4, y + 7)
      // Valor
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cinzaEscuro)
      const valorTruncado = card.valor.length > 16 ? card.valor.slice(0, 15) + '…' : card.valor
      doc.text(valorTruncado, x + 4, y + 17)
    })

    y += 32

    // ===== DISTRIBUIÇÃO POR TIPO =====
    checkPageBreak(60)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cinzaEscuro)
    doc.text('Distribuição por Tipo de Crime', margin, y)
    y += 8

    const maxTipo = Math.max(...r.porTipo.map(t => t.total), 1)
    r.porTipo.forEach(t => {
      checkPageBreak(10)
      // Label
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cinzaEscuro)
      doc.text(t.label, margin, y + 4)

      // Barra de fundo
      const barX = margin + 45
      const barMaxWidth = contentWidth - 80
      doc.setFillColor(230, 233, 240)
      doc.roundedRect(barX, y, barMaxWidth, 5, 1, 1, 'F')

      // Barra preenchida
      const barWidth = (t.total / maxTipo) * barMaxWidth
      const cor = hexToRgb(t.cor)
      doc.setFillColor(cor[0], cor[1], cor[2])
      doc.roundedRect(barX, y, Math.max(barWidth, 2), 5, 1, 1, 'F')

      // Valor
      doc.setFontSize(7)
      doc.setTextColor(...cinzaClaro)
      doc.text(`${t.total} (${t.percentual}%)`, barX + barMaxWidth + 3, y + 4)

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
      body: r.porBairro.map((b, i) => [
        (i + 1).toString(),
        b.bairro,
        b.total.toString(),
        b.percentual + '%',
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

    y = (doc as any).lastAutoTable.finalY + 10

    // ===== STATUS =====
    checkPageBreak(25)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cinzaEscuro)
    doc.text('Status das Ocorrências', margin, y)
    y += 8

    r.porStatus.forEach((s, i) => {
      const x = margin + i * 55
      // Dot
      const cor = hexToRgb(s.cor)
      doc.setFillColor(cor[0], cor[1], cor[2])
      doc.circle(x + 3, y + 2, 2, 'F')
      // Label
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cinzaClaro)
      doc.text(s.label, x + 8, y + 3)
      // Count
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cinzaEscuro)
      doc.text(s.total.toString(), x + 8 + doc.getTextWidth(s.label) + 3, y + 3)
    })

    y += 15

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
      pageHeight - 10
    )
    doc.text(
      `G-SEG Intelligence © ${new Date().getFullYear()}`,
      pageWidth - margin - doc.getTextWidth(`G-SEG Intelligence © ${new Date().getFullYear()}`),
      pageHeight - 10
    )

    // ===== DOWNLOAD =====
    const hoje = new Date().toISOString().split('T')[0]
    doc.save(`gseg-relatorio-${hoje}.pdf`)

    toast.success('PDF exportado com sucesso!')
  }

  // Bairros disponíveis (pra select)
  const bairrosDisponiveis = computed(() => {
    const set = new Set(crimes.map(c => c.bairro))
    return [...set].sort()
  })

  return {
    config,
    gerado,
    crimesFiltrados,
    resumo,
    bairrosDisponiveis,
    gerarRelatorio,
    voltarConfig,
    exportarCsv,
    exportarPdf,
  }
}
