<template>
  <div class="comparativo-container">
    <div class="comparativo-header">
      <h3 class="comparativo-titulo">Comparativo Temporal</h3>
      <div class="modo-btns">
        <button
          class="modo-btn"
          :class="{ active: modo === 'mes' }"
          @click="alterarModo('mes')"
        >
          Mensal
        </button>
        <button
          class="modo-btn"
          :class="{ active: modo === 'ano' }"
          @click="alterarModo('ano')"
        >
          Anual
        </button>
      </div>
    </div>

    <template v-if="erro">
      <div class="comparativo-feedback">
        <ErrorMessage :message="erro" />
        <BaseButton variant="secondary" size="sm" @click="carregar">
          Recarregar
        </BaseButton>
      </div>
    </template>

    <template v-else-if="carregando">
      <div class="comparativo-skeleton">
        <div v-for="i in 4" :key="i" class="comp-card skeleton-card"></div>
      </div>
    </template>

    <template v-else>
      <div class="periodo-labels">
        <span class="periodo-atual">
          <i class="mdi mdi-circle" style="color: #3b82f6; font-size: 0.5rem;"></i>
          {{ labelAtual }}
        </span>
        <span class="periodo-anterior">
          <i class="mdi mdi-circle" style="color: #475569; font-size: 0.5rem;"></i>
          {{ labelAnterior }}
        </span>
      </div>

      <div class="comparativo-grid">
        <div v-for="item in metricas" :key="item.label" class="comp-card">
          <span class="comp-label">{{ item.label }}</span>
          <div class="comp-valores">
            <span class="comp-atual">{{ item.atual }}</span>
            <span
              class="comp-variacao"
              :class="item.variacao >= 0 ? 'up' : 'down'"
            >
              <i :class="item.variacao >= 0 ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'"></i>
              {{ Math.abs(item.variacao) }}%
            </span>
          </div>
          <div v-if="item.referencia" class="comp-referencia">
            {{ item.referencia }}
          </div>
          <div class="comp-barra-wrapper">
            <div class="comp-barra anterior" :style="{ width: barraWidth(item.anterior, item.atual) }"></div>
            <div class="comp-barra atual" :style="{ width: barraWidth(item.atual, item.anterior) }"></div>
          </div>
          <div class="comp-detalhe">
            <span>Anterior: {{ item.anterior }}</span>
            <span v-if="item.referenciaAnterior">({{ item.referenciaAnterior }})</span>
          </div>
        </div>
      </div>

      <div class="mudancas-section">
        <h4 class="mudancas-titulo">Maiores Mudancas por Categoria</h4>
        <div v-if="mudancasCategorias.length" class="mudancas-lista">
          <div
            v-for="mudanca in mudancasCategorias"
            :key="mudanca.label"
            class="mudanca-item"
          >
            <span class="mudanca-bairro">{{ mudanca.label }}</span>
            <div class="mudanca-valores">
              <span class="mudanca-numeros">{{ mudanca.anterior }} -> {{ mudanca.atual }}</span>
              <span
                class="mudanca-var"
                :class="mudanca.variacao >= 0 ? 'up' : 'down'"
              >
                {{ mudanca.variacao >= 0 ? '+' : '' }}{{ mudanca.variacao }}%
              </span>
            </div>
          </div>
        </div>
        <div v-else class="mudancas-vazio">
          Sem categorias suficientes para comparar neste periodo.
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import {
  analyticsService,
  type AnalyticsResponse,
  type LabelTotal,
} from '@/features/analytics/services/analyticsService'
import { labelNatureza } from '@/features/mapa-crimes/types/crime'

type ModoComparativo = 'mes' | 'ano'

const modo = ref<ModoComparativo>('mes')
const atual = ref<AnalyticsResponse | null>(null)
const anterior = ref<AnalyticsResponse | null>(null)
const carregando = ref(false)
const erro = ref<string | null>(null)

const meses = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

function formatarData(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')

  return `${ano}-${mes}-${dia}`
}

function ultimoDiaDoMes(ano: number, mes: number): number {
  return new Date(ano, mes + 1, 0).getDate()
}

function maiorItem(lista: LabelTotal[] | undefined): LabelTotal | null {
  if (!lista?.length) return null

  return lista.reduce((maior, item) => (item.total > maior.total ? item : maior))
}

function encontrarItem(lista: LabelTotal[] | undefined, label: string | null): LabelTotal | null {
  if (!label) return null
  return lista?.find((item) => item.label === label) ?? null
}

function construirPeriodos() {
  const agora = new Date()
  const ano = agora.getFullYear()
  const mes = agora.getMonth()
  const dia = agora.getDate()

  if (modo.value === 'mes') {
    const atualInicio = new Date(ano, mes, 1)
    const atualFim = new Date(ano, mes, dia)
    const mesAnterior = mes === 0 ? 11 : mes - 1
    const anoAnterior = mes === 0 ? ano - 1 : ano
    const diaAnterior = Math.min(dia, ultimoDiaDoMes(anoAnterior, mesAnterior))
    const anteriorInicio = new Date(anoAnterior, mesAnterior, 1)
    const anteriorFim = new Date(anoAnterior, mesAnterior, diaAnterior)

    return {
      atual: {
        dataInicio: formatarData(atualInicio),
        dataFim: formatarData(atualFim),
      },
      anterior: {
        dataInicio: formatarData(anteriorInicio),
        dataFim: formatarData(anteriorFim),
      },
      labelAtual: `${meses[mes]} ${ano}`,
      labelAnterior: `${meses[mesAnterior]} ${anoAnterior}`,
    }
  }

  const atualInicio = new Date(ano, 0, 1)
  const atualFim = new Date(ano, mes, dia)
  const diaAnterior = Math.min(dia, ultimoDiaDoMes(ano - 1, mes))
  const anteriorInicio = new Date(ano - 1, 0, 1)
  const anteriorFim = new Date(ano - 1, mes, diaAnterior)

  return {
    atual: {
      dataInicio: formatarData(atualInicio),
      dataFim: formatarData(atualFim),
    },
    anterior: {
      dataInicio: formatarData(anteriorInicio),
      dataFim: formatarData(anteriorFim),
    },
    labelAtual: `${ano}`,
    labelAnterior: `${ano - 1}`,
  }
}

function calcVar(atualValor: number, anteriorValor: number): number {
  if (anteriorValor === 0) return atualValor > 0 ? 100 : 0
  return Math.round(((atualValor - anteriorValor) / anteriorValor) * 100)
}

async function carregar() {
  carregando.value = true
  erro.value = null

  try {
    const periodos = construirPeriodos()
    const [atualData, anteriorData] = await Promise.all([
      analyticsService.get(periodos.atual),
      analyticsService.get(periodos.anterior),
    ])

    atual.value = atualData
    anterior.value = anteriorData
  } catch {
    erro.value = 'Erro ao carregar comparativo temporal'
    atual.value = null
    anterior.value = null
  } finally {
    carregando.value = false
  }
}

function alterarModo(novoModo: ModoComparativo) {
  modo.value = novoModo
}

const periodos = computed(() => construirPeriodos())
const labelAtual = computed(() => periodos.value.labelAtual)
const labelAnterior = computed(() => periodos.value.labelAnterior)

const metricas = computed(() => {
  const topNaturezaAtual = maiorItem(atual.value?.porNatureza)
  const topNaturezaAnterior = encontrarItem(
    anterior.value?.porNatureza,
    topNaturezaAtual?.label ?? null,
  )
  const faixaAtual = maiorItem(atual.value?.porFaixaHoraria)
  const faixaAnterior = encontrarItem(
    anterior.value?.porFaixaHoraria,
    faixaAtual?.label ?? null,
  )
  const categoriaAtual = maiorItem(atual.value?.topCategorias)
  const categoriaAnterior = encontrarItem(
    anterior.value?.topCategorias,
    categoriaAtual?.label ?? null,
  )

  const totalAtual = atual.value?.totalCrimes ?? 0
  const totalAnterior = anterior.value?.totalCrimes ?? 0

  return [
    {
      label: 'Total de Ocorrencias',
      atual: totalAtual,
      anterior: totalAnterior,
      variacao: calcVar(totalAtual, totalAnterior),
      referencia: null,
      referenciaAnterior: null,
    },
    {
      label: 'Natureza Lider',
      atual: topNaturezaAtual?.total ?? 0,
      anterior: topNaturezaAnterior?.total ?? 0,
      variacao: calcVar(topNaturezaAtual?.total ?? 0, topNaturezaAnterior?.total ?? 0),
      referencia: topNaturezaAtual ? labelNatureza(topNaturezaAtual.label) : 'Sem dados',
      referenciaAnterior: topNaturezaAtual ? labelNatureza(topNaturezaAtual.label) : null,
    },
    {
      label: 'Faixa de Pico',
      atual: faixaAtual?.total ?? 0,
      anterior: faixaAnterior?.total ?? 0,
      variacao: calcVar(faixaAtual?.total ?? 0, faixaAnterior?.total ?? 0),
      referencia: faixaAtual?.label ?? 'Sem dados',
      referenciaAnterior: faixaAtual?.label ?? null,
    },
    {
      label: 'Categoria Top',
      atual: categoriaAtual?.total ?? 0,
      anterior: categoriaAnterior?.total ?? 0,
      variacao: calcVar(categoriaAtual?.total ?? 0, categoriaAnterior?.total ?? 0),
      referencia: categoriaAtual?.label ?? 'Sem dados',
      referenciaAnterior: categoriaAtual?.label ?? null,
    },
  ]
})

const mudancasCategorias = computed(() => {
  const atualMap = new Map(
    (atual.value?.topCategorias ?? []).map((item) => [item.label, item.total]),
  )
  const anteriorMap = new Map(
    (anterior.value?.topCategorias ?? []).map((item) => [item.label, item.total]),
  )
  const labels = new Set([...atualMap.keys(), ...anteriorMap.keys()])

  return [...labels]
    .map((label) => {
      const atualTotal = atualMap.get(label) ?? 0
      const anteriorTotal = anteriorMap.get(label) ?? 0

      return {
        label,
        atual: atualTotal,
        anterior: anteriorTotal,
        variacao: calcVar(atualTotal, anteriorTotal),
        diferenca: Math.abs(atualTotal - anteriorTotal),
      }
    })
    .filter((item) => item.diferenca > 0)
    .sort((a, b) => b.diferenca - a.diferenca)
    .slice(0, 5)
})

function barraWidth(valor: number, outro: number): string {
  const max = Math.max(valor, outro, 1)
  return `${Math.round((valor / max) * 100)}%`
}

watch(modo, () => {
  void carregar()
}, { immediate: true })
</script>

<style scoped>
.comparativo-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
}

.comparativo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.comparativo-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.modo-btns {
  display: flex;
  gap: 0;
  background: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #334155;
}

.modo-btn {
  padding: 0.375rem 0.875rem;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modo-btn.active {
  background: #3b82f6;
  color: white;
}

.periodo-labels {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.periodo-atual,
.periodo-anterior {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.comparativo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comp-card {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.comp-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.comp-valores {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comp-atual {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.comp-variacao {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.comp-variacao.up {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.comp-variacao.down {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.comp-referencia {
  font-size: 0.75rem;
  color: #cbd5e1;
}

.comp-barra-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 0.25rem;
}

.comp-barra {
  height: 4px;
  border-radius: 2px;
  transition: width 0.5s ease;
  min-width: 4px;
}

.comp-barra.atual {
  background: #3b82f6;
}

.comp-barra.anterior {
  background: #475569;
}

.comp-detalhe {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  font-size: 0.6875rem;
  color: #475569;
  margin-top: 0.125rem;
}

.comparativo-feedback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.comparativo-skeleton {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.skeleton-card {
  min-height: 132px;
  background: linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  background-size: 200% 100%;
  animation: pulse 1.5s ease-in-out infinite;
}

.mudancas-section {
  border-top: 1px solid #334155;
  padding-top: 1.25rem;
}

.mudancas-titulo {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.75rem;
}

.mudancas-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mudanca-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #0f172a;
  border-radius: 8px;
}

.mudanca-bairro {
  font-size: 0.8125rem;
  color: #e2e8f0;
  font-weight: 500;
}

.mudanca-valores {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mudanca-numeros {
  font-size: 0.75rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.mudanca-var {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.mudanca-var.up {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.mudanca-var.down {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.mudancas-vazio {
  color: #64748b;
  font-size: 0.8125rem;
}

@keyframes pulse {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 600px) {
  .comparativo-grid {
    grid-template-columns: 1fr;
  }

  .comparativo-skeleton {
    grid-template-columns: 1fr;
  }

  .comparativo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
