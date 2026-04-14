import { onUnmounted, ref, watch } from 'vue'
import {
  analyticsService,
  type AnalyticsResponse,
} from '../services/analyticsService'

export function useAnalytics() {
  const dados = ref<AnalyticsResponse | null>(null)
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
      dados.value = await analyticsService.get({
        dataInicio: filtros.value.dataInicio || undefined,
        dataFim: filtros.value.dataFim || undefined,
        bairro: filtros.value.bairro || undefined,
      })
    } catch {
      erro.value = 'Erro ao carregar analytics'
      dados.value = null
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
    filtros,
    carregando,
    erro,
    recarregar: carregar,
  }
}
