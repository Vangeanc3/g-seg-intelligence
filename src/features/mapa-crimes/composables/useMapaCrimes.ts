import { ref, computed } from 'vue'
import type { Crime, TipoCrime, FiltrosCrime } from '../types/crime'
import { getCrimes, getCrimesGeoJSON } from '../services/crimeService'

export function useMapaCrimes() {
  const crimes = ref<Crime[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filtros = ref<FiltrosCrime>({
    tipos: [],
    dataInicio: '',
    dataFim: '',
    bairros: [],
  })
  const visualizacao = ref<'pontos' | 'heatmap' | 'clusters'>('pontos')

  const crimesFiltrados = computed(() => {
    let resultado = crimes.value

    if (filtros.value.tipos.length > 0) {
      resultado = resultado.filter((c) => filtros.value.tipos.includes(c.tipo))
    }
    if (filtros.value.bairros.length > 0) {
      resultado = resultado.filter((c) => filtros.value.bairros.includes(c.bairro))
    }
    if (filtros.value.dataInicio) {
      resultado = resultado.filter((c) => c.data >= filtros.value.dataInicio)
    }
    if (filtros.value.dataFim) {
      resultado = resultado.filter((c) => c.data <= filtros.value.dataFim)
    }

    return resultado
  })

  const geojson = computed(() => getCrimesGeoJSON(crimesFiltrados.value))

  const bairrosDisponiveis = computed(() => {
    const set = new Set(crimes.value.map((c) => c.bairro))
    return Array.from(set).sort()
  })

  const estatisticas = computed(() => ({
    total: crimesFiltrados.value.length,
    porTipo: Object.entries(
      crimesFiltrados.value.reduce(
        (acc, c) => {
          acc[c.tipo] = (acc[c.tipo] || 0) + 1
          return acc
        },
        {} as Record<string, number>
      )
    ),
  }))

  async function carregarCrimes() {
    loading.value = true
    error.value = null
    try {
      crimes.value = await getCrimes()
    } catch (e) {
      error.value = 'Erro ao carregar crimes'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  function toggleTipo(tipo: TipoCrime) {
    const index = filtros.value.tipos.indexOf(tipo)
    if (index === -1) {
      filtros.value.tipos.push(tipo)
    } else {
      filtros.value.tipos.splice(index, 1)
    }
  }

  function limparFiltros() {
    filtros.value = { tipos: [], dataInicio: '', dataFim: '', bairros: [] }
  }

  return {
    crimes,
    crimesFiltrados,
    geojson,
    loading,
    error,
    filtros,
    visualizacao,
    bairrosDisponiveis,
    estatisticas,
    carregarCrimes,
    toggleTipo,
    limparFiltros,
  }
}
