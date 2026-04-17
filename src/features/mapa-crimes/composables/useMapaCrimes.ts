import { computed, onUnmounted, ref, watch } from 'vue'
import { crimesService } from '../services/crimesService'
import {
  riscoService,
  type BairrosPoligonosGeoJson,
  type RiscoFiltros,
  type RuasRiscoGeoJson,
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
  const ruasRisco = ref<RuasRiscoGeoJson>({
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
    precisao: [],
  })

  let timer: ReturnType<typeof setTimeout> | null = null

  const filtrosApi = computed(() => ({
    natureza: filtros.value.natureza || undefined,
    bairro: filtros.value.bairro || undefined,
    dataInicio: filtros.value.dataInicio || undefined,
    dataFim: filtros.value.dataFim || undefined,
  }))

  function criarFiltrosRisco(): RiscoFiltros {
    return {
      dataInicio: filtrosApi.value.dataInicio,
      dataFim: filtrosApi.value.dataFim,
      natureza: filtrosApi.value.natureza,
    }
  }

  async function carregarCrimes() {
    carregando.value = true
    erro.value = null

    try {
      const response = await crimesService.getGeoJson(filtrosApi.value)

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
      bairrosPoligonos.value = await riscoService.getBairrosPoligonos(
        criarFiltrosRisco(),
      )
    } catch (error) {
      console.error('Erro ao carregar poligonos de bairros:', error)
      bairrosPoligonos.value = { type: 'FeatureCollection', features: [] }
    }
  }

  async function carregarRuasRisco() {
    try {
      ruasRisco.value = await riscoService.getRuasRisco(criarFiltrosRisco())
    } catch (error) {
      console.error('Erro ao carregar ruas de risco:', error)
      ruasRisco.value = { type: 'FeatureCollection', features: [] }
    }
  }

  async function recarregarTudo() {
    await Promise.allSettled([
      carregarCrimes(),
      carregarBairrosPoligonos(),
      carregarRuasRisco(),
    ])
  }

  function limparFiltros() {
    filtros.value = {
      natureza: '',
      bairro: '',
      dataInicio: '',
      dataFim: '',
      precisao: [],
    }
  }

  watch(
    filtrosApi,
    () => {
      if (timer) clearTimeout(timer)

      timer = setTimeout(() => {
        void recarregarTudo()
      }, 300)
    },
    { deep: true },
  )

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  void recarregarTudo()

  const geojsonFiltrado = computed<CrimesGeoJson>(() => {
    if (filtros.value.precisao.length === 0) {
      return geojson.value
    }

    return {
      ...geojson.value,
      features: geojson.value.features.filter((feature) =>
        filtros.value.precisao.includes(feature.properties.precisaoCoordenada),
      ),
    }
  })

  const crimesFiltrados = computed(() => geojsonFiltrado.value.features)
  const totalCrimes = computed(() => geojsonFiltrado.value.features.length)

  const tiposCrime = computed(() => {
    const contagem: Record<string, number> = {}

    geojsonFiltrado.value.features.forEach((feature) => {
      const natureza = feature.properties.natureza
      contagem[natureza] = (contagem[natureza] || 0) + 1
    })

    return contagem
  })

  return {
    geojson,
    geojsonFiltrado,
    bairrosPoligonos,
    ruasRisco,
    crimesFiltrados,
    filtros,
    tiposCrime,
    bairrosDisponiveis,
    totalCrimes,
    carregando,
    erro,
    limparFiltros,
    recarregar: recarregarTudo,
  }
}
