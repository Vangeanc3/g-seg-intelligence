import { computed, ref } from 'vue'
import { riscoService, type NivelRisco } from '@/features/mapa-crimes/services/riscoService'
import { comparativoService, type ComparativoBairro } from '../services/comparativoService'

export function useComparativo() {
  const bairroA = ref<ComparativoBairro>({
    nome: '',
    dados: null,
    carregando: false,
    erro: null,
  })
  const bairroB = ref<ComparativoBairro>({
    nome: '',
    dados: null,
    carregando: false,
    erro: null,
  })
  const bairrosDisponiveis = ref<string[]>([])
  const riscoPorBairro = ref<Record<string, NivelRisco>>({})
  const carregandoBairros = ref(false)

  let requestId = 0

  async function carregarBairros() {
    carregandoBairros.value = true

    try {
      const data = await riscoService.getBairrosPoligonos()
      const bairros = new Set(
        data.features.map((feature) => feature.properties.nome).filter((nome) => !!nome),
      )
      riscoPorBairro.value = data.features.reduce<Record<string, NivelRisco>>((acc, feature) => {
        acc[feature.properties.nome] = feature.properties.nivelRisco
        return acc
      }, {})

      bairrosDisponiveis.value = Array.from(bairros).sort((a, b) => a.localeCompare(b, 'pt-BR'))
    } catch {
      bairrosDisponiveis.value = []
      riscoPorBairro.value = {}
    } finally {
      carregandoBairros.value = false
    }
  }

  function limparDadosSeIncompleto() {
    if (bairroA.value.nome && bairroB.value.nome) return

    bairroA.value.dados = null
    bairroA.value.erro = null
    bairroA.value.carregando = false
    bairroB.value.dados = null
    bairroB.value.erro = null
    bairroB.value.carregando = false
  }

  async function carregarComparativo() {
    if (!bairroA.value.nome || !bairroB.value.nome) {
      limparDadosSeIncompleto()
      return
    }

    const atualRequestId = ++requestId
    bairroA.value.carregando = true
    bairroB.value.carregando = true
    bairroA.value.erro = null
    bairroB.value.erro = null

    try {
      const [dadosA, dadosB] = await Promise.all([
        comparativoService.getAnalyticsBairro(bairroA.value.nome),
        comparativoService.getAnalyticsBairro(bairroB.value.nome),
      ])

      if (atualRequestId !== requestId) return

      bairroA.value.dados = dadosA
      bairroB.value.dados = dadosB
    } catch {
      if (atualRequestId !== requestId) return

      bairroA.value.erro = 'Erro ao carregar dados'
      bairroB.value.erro = 'Erro ao carregar dados'
      bairroA.value.dados = null
      bairroB.value.dados = null
    } finally {
      if (atualRequestId === requestId) {
        bairroA.value.carregando = false
        bairroB.value.carregando = false
      }
    }
  }

  function selecionarBairroA(nome: string) {
    bairroA.value.nome = nome

    if (nome && nome === bairroB.value.nome) {
      bairroB.value.nome = ''
    }

    void carregarComparativo()
  }

  function selecionarBairroB(nome: string) {
    bairroB.value.nome = nome

    if (nome && nome === bairroA.value.nome) {
      bairroA.value.nome = ''
    }

    void carregarComparativo()
  }

  const comparativo = computed(() => {
    const a = bairroA.value.dados
    const b = bairroB.value.dados
    if (!a || !b) return null

    return {
      totalA: a.totalCrimes,
      totalB: b.totalCrimes,
      diferencaTotal: a.totalCrimes - b.totalCrimes,
      diferencaPct:
        b.totalCrimes > 0 ? Math.round(((a.totalCrimes - b.totalCrimes) / b.totalCrimes) * 100) : 0,
      precisaoA: a.precisao,
      precisaoB: b.precisao,
    }
  })
  const riscoBairroA = computed(() =>
    bairroA.value.nome ? riscoPorBairro.value[bairroA.value.nome] : undefined,
  )
  const riscoBairroB = computed(() =>
    bairroB.value.nome ? riscoPorBairro.value[bairroB.value.nome] : undefined,
  )

  void carregarBairros()

  return {
    bairroA,
    bairroB,
    bairrosDisponiveis,
    carregandoBairros,
    selecionarBairroA,
    selecionarBairroB,
    comparativo,
    riscoBairroA,
    riscoBairroB,
  }
}
