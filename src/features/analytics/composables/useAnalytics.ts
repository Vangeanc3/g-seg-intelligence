import { onUnmounted, ref, watch } from 'vue'
import {
  analyticsService,
  type AnalyticsResponse,
  type RuaRankingItem,
} from '../services/analyticsService'

export function useAnalytics() {
  const dados = ref<AnalyticsResponse | null>(null)
  const topRuas = ref<RuaRankingItem[]>([])
  const carregando = ref(false)
  const erro = ref<string | null>(null)

  const filtros = ref({
    dataInicio: '',
    dataFim: '',
    bairro: '',
  })

  let timer: ReturnType<typeof setTimeout> | null = null

  async function carregar() {
    carregando.value = true
    erro.value = null

    try {
      const filtrosAtivos = {
        dataInicio: filtros.value.dataInicio || undefined,
        dataFim: filtros.value.dataFim || undefined,
        bairro: filtros.value.bairro || undefined,
      }

      const [analyticsData, ruasData] = await Promise.all([
        analyticsService.get(filtrosAtivos),
        analyticsService.getTopRuas({
          ...filtrosAtivos,
          limite: 15,
        }),
      ])

      dados.value = analyticsData
      topRuas.value = ruasData
    } catch {
      erro.value = 'Erro ao carregar analytics'
      dados.value = null
      topRuas.value = []
    } finally {
      carregando.value = false
    }
  }

  watch(
    filtros,
    () => {
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        void carregar()
      }, 300)
    },
    { deep: true },
  )

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  void carregar()

  return {
    dados,
    topRuas,
    filtros,
    carregando,
    erro,
    recarregar: carregar,
  }
}
