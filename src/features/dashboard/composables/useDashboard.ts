import { computed, ref } from 'vue'
import {
  analyticsService,
  type AnalyticsResponse,
  type LabelTotal,
} from '@/features/analytics/services/analyticsService'
import {
  crimesService,
  type CrimesGeoJson,
} from '@/features/mapa-crimes/services/crimesService'
import { corNatureza, labelNatureza } from '@/features/mapa-crimes/types/crime'
import type {
  CrimeByDate,
  CrimeByType,
  DateFilterOption,
} from '../types/dashboard'

function formatarData(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function criarFiltrosPeriodo(periodo: DateFilterOption) {
  const fim = new Date()
  const inicio = new Date()
  const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90

  inicio.setDate(inicio.getDate() - dias)

  return {
    dataInicio: formatarData(inicio),
    dataFim: formatarData(fim),
  }
}

function maiorItem(lista: LabelTotal[] | undefined): LabelTotal | null {
  if (!lista?.length) return null

  return lista.reduce((maior, atual) => (
    atual.total > maior.total ? atual : maior
  ))
}

function crimeDateTime(crime: CrimesGeoJson['features'][number]): string {
  return `${crime.properties.dataFato}T${crime.properties.horaFato || '00:00:00'}`
}

export function useDashboard() {
  const analytics = ref<AnalyticsResponse | null>(null)
  const crimesRecentes = ref<CrimesGeoJson['features']>([])
  const carregando = ref(false)
  const erro = ref<string | null>(null)
  const dateFilter = ref<DateFilterOption>('30d')

  async function carregar() {
    carregando.value = true
    erro.value = null

    try {
      const filtros = criarFiltrosPeriodo(dateFilter.value)

      const [analyticsData, geoJson] = await Promise.all([
        analyticsService.get(filtros),
        crimesService.getGeoJson(filtros),
      ])

      analytics.value = analyticsData
      crimesRecentes.value = [...geoJson.features]
        .sort((a, b) => crimeDateTime(b).localeCompare(crimeDateTime(a)))
        .slice(0, 10)
    } catch {
      erro.value = 'Erro ao carregar dashboard'
      analytics.value = null
      crimesRecentes.value = []
    } finally {
      carregando.value = false
    }
  }

  function updateDateFilter(filter: string) {
    dateFilter.value = filter as DateFilterOption
    void carregar()
  }

  const totalCrimes = computed(() => analytics.value?.totalCrimes ?? 0)

  const tipoMaisFrequente = computed(() => {
    const top = maiorItem(analytics.value?.porNatureza)
    return top ? { nome: labelNatureza(top.label), total: top.total } : null
  })

  const faixaPico = computed(() => {
    const top = maiorItem(analytics.value?.porFaixaHoraria)
    return top ? { label: top.label, total: top.total } : { label: '-', total: 0 }
  })

  const categoriaTop = computed(() => {
    const top = maiorItem(analytics.value?.topCategorias)
    return top ? { nome: top.label, total: top.total } : null
  })

  const crimesByDate = computed<CrimeByDate[]>(() =>
    (analytics.value?.porMes || []).map((item) => ({
      date: `${item.label}-01`,
      count: item.total,
    })),
  )

  const crimesByType = computed<CrimeByType[]>(() => {
    const dados = analytics.value?.porNatureza || []
    const total = dados.reduce((acc, item) => acc + item.total, 0) || 1

    return dados.map((item) => ({
      type: labelNatureza(item.label),
      count: item.total,
      percentage: Math.round((item.total / total) * 100),
      color: corNatureza(item.label),
    }))
  })

  void carregar()

  return {
    analytics,
    crimesRecentes,
    totalCrimes,
    tipoMaisFrequente,
    faixaPico,
    categoriaTop,
    crimesByDate,
    crimesByType,
    dateFilter,
    carregando,
    erro,
    updateDateFilter,
    recarregar: carregar,
  }
}
