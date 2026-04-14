import { computed, onUnmounted, ref, watch } from 'vue'
import { crimesService } from '../services/crimesService'
import {
  riscoService,
  type BairrosPoligonosGeoJson,
} from '../services/riscoService'
import {
  criarGeoJsonVazio,
  type CrimesGeoJson,
  type FiltrosCrime,
} from '../types/crime'

function extrairBairros(geojson: CrimesGeoJson): string[] {
  const bairros = new Set(
    geojson.features
      .map((feature) => feature.properties.bairro)
      .filter((bairro) => !!bairro),
  )

  return Array.from(bairros).sort((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function useMapaCrimes() {
  const geojson = ref<CrimesGeoJson>(criarGeoJsonVazio())
  const bairrosPoligonos = ref<BairrosPoligonosGeoJson>({
    type: 'FeatureCollection',
    features: [],
  })
  const carregando = ref(false)
  const erro = ref<string | null>(null)
  const bairrosDisponiveis = ref<string[]>([])
  const filtros = ref<FiltrosCrime>({
    natureza: '',
    bairro: '',
    dataInicio: '',
    dataFim: '',
  })

  let timer: ReturnType<typeof setTimeout> | null = null

  async function carregarCrimes() {
    carregando.value = true
    erro.value = null

    try {
      const response = await crimesService.getGeoJson({
        natureza: filtros.value.natureza || undefined,
        bairro: filtros.value.bairro || undefined,
        dataInicio: filtros.value.dataInicio || undefined,
        dataFim: filtros.value.dataFim || undefined,
      })

      geojson.value = response

      const bairros = extrairBairros(response)
      if (bairros.length > 0) {
        bairrosDisponiveis.value = bairros
      }
    } catch {
      erro.value = 'Erro ao carregar crimes. Verifique o servidor.'
      geojson.value = criarGeoJsonVazio()
    } finally {
      carregando.value = false
    }
  }

  async function carregarBairrosPoligonos() {
    try {
      bairrosPoligonos.value = await riscoService.getBairrosPoligonos({
        dataInicio: filtros.value.dataInicio || undefined,
        dataFim: filtros.value.dataFim || undefined,
        natureza: filtros.value.natureza || undefined,
      })
    } catch (error) {
      console.error('Erro ao carregar poligonos de bairros:', error)
      bairrosPoligonos.value = { type: 'FeatureCollection', features: [] }
    }
  }

  function limparFiltros() {
    filtros.value = {
      natureza: '',
      bairro: '',
      dataInicio: '',
      dataFim: '',
    }
  }

  watch(
    filtros,
    () => {
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        void carregarCrimes()
        void carregarBairrosPoligonos()
      }, 300)
    },
    { deep: true },
  )

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  void carregarCrimes()
  void carregarBairrosPoligonos()

  const crimesFiltrados = computed(() => geojson.value.features)
  const totalCrimes = computed(() => geojson.value.features.length)

  const tiposCrime = computed(() => {
    const contagem: Record<string, number> = {}

    geojson.value.features.forEach((feature) => {
      const natureza = feature.properties.natureza
      contagem[natureza] = (contagem[natureza] || 0) + 1
    })

    return contagem
  })

  return {
    geojson,
    bairrosPoligonos,
    crimesFiltrados,
    filtros,
    tiposCrime,
    bairrosDisponiveis,
    totalCrimes,
    carregando,
    erro,
    limparFiltros,
    recarregar: carregarCrimes,
  }
}
