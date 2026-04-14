<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1>Analytics</h1>
      <p class="subtitle">Analise de dados criminais - Belem/PA</p>
    </div>

    <div class="filtros-section">
      <div class="periodo-buttons">
        <button
          v-for="opcao in periodos"
          :key="opcao.value"
          class="periodo-btn"
          :class="{ active: periodoAtivo === opcao.value }"
          @click="selecionarPeriodo(opcao.value)"
        >
          {{ opcao.label }}
        </button>
      </div>

      <div class="filtros-grid">
        <input
          :value="filtros.dataInicio"
          type="date"
          class="filtro-input"
          @input="atualizarDataInicio(($event.target as HTMLInputElement).value)"
        />
        <input
          :value="filtros.dataFim"
          type="date"
          class="filtro-input"
          @input="atualizarDataFim(($event.target as HTMLInputElement).value)"
        />
        <input
          :value="filtros.bairro"
          type="text"
          class="filtro-input"
          placeholder="Filtrar por bairro"
          @input="atualizarBairro(($event.target as HTMLInputElement).value)"
        />
        <button class="btn-limpar" @click="limparFiltros">Limpar</button>
      </div>
    </div>

    <template v-if="carregando">
      <div class="analytics-cards-sk">
        <SkeletonLoader v-for="i in 4" :key="i" tipo="card" />
      </div>

      <div class="graficos-row full">
        <SkeletonLoader tipo="grafico" />
      </div>
      <div class="graficos-row two-cols">
        <SkeletonLoader tipo="grafico" />
        <SkeletonLoader tipo="grafico" />
      </div>
      <div class="graficos-row two-cols">
        <SkeletonLoader tipo="grafico" />
        <SkeletonLoader tipo="grafico" />
      </div>
      <SkeletonLoader tipo="tabela" :linhas="8" />
    </template>

    <template v-else-if="temDados">
      <AnalyticsCards
        :total="analyticsDados.totalCrimes"
        :por-natureza="analyticsDados.porNatureza"
        :por-faixa-horaria="analyticsDados.porFaixaHoraria"
        :top-categorias="analyticsDados.topCategorias"
      />

      <div class="graficos-row full">
        <GraficoEvolucao :dados="analyticsDados.porMes" />
      </div>

      <div class="graficos-row two-cols">
        <GraficoTipos :dados="analyticsDados.porNatureza" />
        <EmptyState
          titulo="Top bairros em breve"
          descricao="A API atual ainda nao retorna ranking por bairro. Assim que o backend liberar, esse bloco volta automaticamente."
          icone="mdi mdi-map-marker-radius"
          cor="#3b82f6"
        />
      </div>

      <div class="graficos-row two-cols">
        <GraficoDiaSemana :dados="analyticsDados.porDiaSemana" />
        <GraficoHorario :dados="analyticsDados.porFaixaHoraria" />
      </div>

      <div class="graficos-row full tabela-row">
        <TabelaRanking :dados="analyticsDados.topCategorias" titulo="Top Categorias de Crimes" />
      </div>
    </template>

    <EmptyState
      v-else-if="erro"
      titulo="Erro ao carregar analytics"
      :descricao="erro"
      icone="mdi mdi-chart-box-outline"
      cor="#ef4444"
    >
      <template #acao>
        <button class="btn-tentar" @click="void recarregar()">Tentar novamente</button>
      </template>
    </EmptyState>

    <EmptyState
      v-else
      titulo="Sem dados"
      descricao="Nao ha dados de analytics para os filtros selecionados."
      icone="mdi mdi-chart-line-variant"
      cor="#8b5cf6"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import AnalyticsCards from './components/AnalyticsCards.vue'
import GraficoEvolucao from './components/GraficoEvolucao.vue'
import GraficoTipos from './components/GraficoTipos.vue'
import GraficoDiaSemana from './components/GraficoDiaSemana.vue'
import GraficoHorario from './components/GraficoHorario.vue'
import TabelaRanking from './components/TabelaRanking.vue'
import { useAnalytics } from './composables/useAnalytics'
import type { AnalyticsResponse } from './services/analyticsService'

type PeriodoRapido = '7d' | '30d' | '90d' | 'ano'

const {
  dados,
  filtros,
  carregando,
  erro,
  recarregar,
} = useAnalytics()

const periodoAtivo = ref<PeriodoRapido | null>(null)
const analyticsDados = computed<AnalyticsResponse>(() =>
  dados.value ?? {
    totalCrimes: 0,
    porNatureza: [],
    porDiaSemana: [],
    porFaixaHoraria: [],
    porMes: [],
    topCategorias: [],
  },
)
const temDados = computed(() => (dados.value?.totalCrimes || 0) > 0)

const periodos: Array<{ value: PeriodoRapido; label: string }> = [
  { value: '7d', label: '7 dias' },
  { value: '30d', label: '30 dias' },
  { value: '90d', label: '90 dias' },
  { value: 'ano', label: 'Ano' },
]

function formatarData(data: Date): string {
  return data.toISOString().split('T')[0] || ''
}

function selecionarPeriodo(periodo: PeriodoRapido) {
  const hoje = new Date()
  const inicio = new Date()

  if (periodo === 'ano') {
    inicio.setMonth(0, 1)
  } else {
    const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
    inicio.setDate(inicio.getDate() - dias)
  }

  filtros.value.dataInicio = formatarData(inicio)
  filtros.value.dataFim = formatarData(hoje)
  periodoAtivo.value = periodo
}

function atualizarDataInicio(valor: string) {
  filtros.value.dataInicio = valor
  periodoAtivo.value = null
}

function atualizarDataFim(valor: string) {
  filtros.value.dataFim = valor
  periodoAtivo.value = null
}

function atualizarBairro(valor: string) {
  filtros.value.bairro = valor
}

function limparFiltros() {
  filtros.value.dataInicio = ''
  filtros.value.dataFim = ''
  filtros.value.bairro = ''
  periodoAtivo.value = null
}
</script>

<style scoped>
.analytics-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.filtros-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.periodo-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.periodo-btn,
.btn-limpar,
.btn-tentar {
  padding: 0.5rem 1rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.periodo-btn:hover,
.btn-limpar:hover,
.btn-tentar:hover {
  background: #334155;
  border-color: #475569;
}

.periodo-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.filtro-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.8125rem;
  outline: none;
}

.filtro-input:focus {
  border-color: #3b82f6;
}

.analytics-cards-sk {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.graficos-row {
  margin-top: 1.5rem;
}

.graficos-row.full > * {
  width: 100%;
}

.graficos-row.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.tabela-row {
  margin-top: 0;
}

@media (max-width: 900px) {
  .graficos-row.two-cols,
  .filtros-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .analytics-page {
    padding: 1rem;
    gap: 1rem;
  }

  .page-header h1 {
    font-size: 1.25rem;
  }

  .periodo-btn,
  .btn-limpar,
  .btn-tentar {
    width: 100%;
  }
}
</style>
