import { ref, computed } from 'vue'
import { crimesMock } from '@/features/mapa-crimes/services/crimeService'
import type { Crime } from '@/features/mapa-crimes/types/crime'
import { CRIME_LABELS, CRIME_CORES } from '@/features/mapa-crimes/types/crime'
import type { AnalyticsCard, AnalyticsFiltros } from '../types/analytics'

export function useAnalytics() {
  const crimes = crimesMock

  const filtros = ref<AnalyticsFiltros>({
    periodo: 'all',
    dataInicio: '',
    dataFim: '',
  })

  // Crimes filtrados por período
  const crimesFiltrados = computed(() => {
    let resultado = [...crimes]
    if (filtros.value.dataInicio) {
      resultado = resultado.filter(c => c.data >= filtros.value.dataInicio)
    }
    if (filtros.value.dataFim) {
      resultado = resultado.filter(c => c.data <= filtros.value.dataFim + 'T23:59:59')
    }
    return resultado
  })

  // Crimes do período anterior (para calcular variação %)
  const crimesPeriodoAnterior = computed(() => {
    if (!filtros.value.dataInicio || !filtros.value.dataFim) return []
    const inicio = new Date(filtros.value.dataInicio)
    const fim = new Date(filtros.value.dataFim)
    const duracao = fim.getTime() - inicio.getTime()
    const inicioAnterior = new Date(inicio.getTime() - duracao)
    const fimAnterior = new Date(inicio.getTime() - 1)
    return crimes.filter(c => {
      const d = new Date(c.data)
      return d >= inicioAnterior && d <= fimAnterior
    })
  })

  // Variação percentual
  function calcVariacao(atual: number, anterior: number): number {
    if (anterior === 0) return atual > 0 ? 100 : 0
    return Math.round(((atual - anterior) / anterior) * 100)
  }

  // Bairro com mais crimes
  const bairroMaisPerigoso = computed(() => {
    const contagem: Record<string, number> = {}
    crimesFiltrados.value.forEach(c => {
      contagem[c.bairro] = (contagem[c.bairro] || 0) + 1
    })
    const entries = Object.entries(contagem)
    if (entries.length === 0) return 'N/A'
    return entries.sort((a, b) => b[1] - a[1])[0]![0]
  })

  // Tipo mais frequente
  const tipoMaisFrequente = computed(() => {
    const contagem: Record<string, number> = {}
    crimesFiltrados.value.forEach(c => {
      contagem[c.tipo] = (contagem[c.tipo] || 0) + 1
    })
    const entries = Object.entries(contagem)
    if (entries.length === 0) return 'N/A'
    const tipo = entries.sort((a, b) => b[1] - a[1])[0]![0]
    return CRIME_LABELS[tipo as keyof typeof CRIME_LABELS] || tipo
  })

  // Horário de pico
  const horarioPico = computed(() => {
    const contagem = new Array(24).fill(0)
    crimesFiltrados.value.forEach(c => {
      const hora = new Date(c.data).getHours()
      contagem[hora]++
    })
    const pico = contagem.indexOf(Math.max(...contagem))
    return `${pico.toString().padStart(2, '0')}:00 - ${(pico + 1).toString().padStart(2, '0')}:00`
  })

  // Crimes por bairro (top 10) — bar chart horizontal
  const crimesPorBairro = computed(() => {
    const contagem: Record<string, number> = {}
    crimesFiltrados.value.forEach(c => {
      contagem[c.bairro] = (contagem[c.bairro] || 0) + 1
    })
    return Object.entries(contagem)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
  })

  // Evolução temporal — crimes por dia (line chart)
  const evolucaoTemporal = computed(() => {
    const contagem: Record<string, number> = {}
    crimesFiltrados.value.forEach(c => {
      const dia = c.data.split('T')[0]!
      contagem[dia] = (contagem[dia] || 0) + 1
    })
    return Object.entries(contagem)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([data, total]) => ({
        data: new Date(data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        total,
      }))
  })

  // Distribuição por tipo — donut chart
  const distribuicaoPorTipo = computed(() => {
    const contagem: Record<string, number> = {}
    crimesFiltrados.value.forEach(c => {
      contagem[c.tipo] = (contagem[c.tipo] || 0) + 1
    })
    return Object.entries(contagem).map(([tipo, total]) => ({
      tipo,
      label: CRIME_LABELS[tipo as keyof typeof CRIME_LABELS] || tipo,
      total,
      cor: CRIME_CORES[tipo as keyof typeof CRIME_CORES] || '#6b7280',
    }))
  })

  // Crimes por dia da semana — bar chart
  const crimesPorDiaSemana = computed(() => {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const contagem = new Array(7).fill(0)
    crimesFiltrados.value.forEach(c => {
      const dia = new Date(c.data).getDay()
      contagem[dia]++
    })
    return dias.map((nome, i) => ({ dia: nome, total: contagem[i] }))
  })

  // Crimes por hora do dia — area chart
  const crimesPorHora = computed(() => {
    const contagem = new Array(24).fill(0)
    crimesFiltrados.value.forEach(c => {
      const hora = new Date(c.data).getHours()
      contagem[hora]++
    })
    return contagem.map((total, hora) => ({
      hora: `${hora.toString().padStart(2, '0')}h`,
      total,
    }))
  })

  // Ranking de bairros com detalhes
  const rankingBairros = computed(() => {
    const contagem: Record<string, Record<string, number>> = {}

    crimesFiltrados.value.forEach(c => {
      if (!contagem[c.bairro]) {
        contagem[c.bairro] = { total: 0 }
      }
      const bairroData = contagem[c.bairro]!
      bairroData.total = (bairroData.total || 0) + 1
      bairroData[c.tipo] = (bairroData[c.tipo] || 0) + 1
    })

    // Contagem do período anterior pra variação
    const contagemAnterior: Record<string, number> = {}
    crimesPeriodoAnterior.value.forEach(c => {
      contagemAnterior[c.bairro] = (contagemAnterior[c.bairro] || 0) + 1
    })

    const total = crimesFiltrados.value.length || 1

    return Object.entries(contagem)
      .map(([bairro, dados]) => {
        const anterior = contagemAnterior[bairro] || 0
        const variacao = calcVariacao(dados.total!, anterior)
        // Tipo predominante
        const tipos = Object.entries(dados).filter(([k]) => k !== 'total')
        const tipoPredominante = tipos.length > 0
          ? tipos.sort((a, b) => b[1] - a[1])[0]![0]
          : ''

        return {
          bairro,
          total: dados.total!,
          percentual: Math.round((dados.total! / total) * 100),
          variacao: filtros.value.periodo !== 'all' ? variacao : null,
          tipoPredominante,
        }
      })
      .sort((a, b) => b.total! - a.total!)
      .slice(0, 10)
  })

  // Cards
  const cards = computed<AnalyticsCard[]>(() => {
    const total = crimesFiltrados.value.length
    const totalAnterior = crimesPeriodoAnterior.value.length
    const variacao = calcVariacao(total, totalAnterior)

    return [
      {
        titulo: 'Total de Ocorrências',
        valor: total,
        variacao: filtros.value.periodo !== 'all' ? variacao : undefined,
        subtitulo: 'no período selecionado',
        icone: 'mdi mdi-alert-circle',
        cor: '#3b82f6',
      },
      {
        titulo: 'Bairro Mais Perigoso',
        valor: bairroMaisPerigoso.value,
        subtitulo: 'maior concentração',
        icone: 'mdi mdi-map-marker-alert',
        cor: '#ef4444',
      },
      {
        titulo: 'Tipo Mais Frequente',
        valor: tipoMaisFrequente.value,
        subtitulo: 'no período',
        icone: 'mdi mdi-shield-alert',
        cor: '#f59e0b',
      },
      {
        titulo: 'Horário de Pico',
        valor: horarioPico.value,
        subtitulo: 'maior incidência',
        icone: 'mdi mdi-clock-alert',
        cor: '#8b5cf6',
      },
    ]
  })

  // Função para selecionar período rápido
  function selecionarPeriodo(periodo: '7d' | '30d' | '90d' | 'all') {
    filtros.value.periodo = periodo
    if (periodo === 'all') {
      filtros.value.dataInicio = ''
      filtros.value.dataFim = ''
      return
    }
    const dias = { '7d': 7, '30d': 30, '90d': 90 }[periodo]
    const fim = new Date()
    const inicio = new Date()
    inicio.setDate(inicio.getDate() - dias)
    filtros.value.dataFim = fim.toISOString().split('T')[0]!
    filtros.value.dataInicio = inicio.toISOString().split('T')[0]!
  }

  return {
    filtros,
    crimesFiltrados,
    cards,
    crimesPorBairro,
    evolucaoTemporal,
    distribuicaoPorTipo,
    crimesPorDiaSemana,
    crimesPorHora,
    rankingBairros,
    selecionarPeriodo,
  }
}
