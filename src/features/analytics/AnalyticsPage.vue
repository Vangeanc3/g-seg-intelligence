<template>
  <div class="analytics-page">
    <!-- Header -->
    <div class="page-header">
      <h1>Analytics</h1>
      <p class="subtitle">Análise de dados criminais — Belém/PA</p>
    </div>

    <!-- Filtro de Período -->
    <div class="periodo-section">
      <div class="periodo-buttons">
        <button
          v-for="opcao in periodos"
          :key="opcao.value"
          class="periodo-btn"
          :class="{ active: filtros.periodo === opcao.value }"
          @click="selecionarPeriodo(opcao.value)"
        >
          {{ opcao.label }}
        </button>
      </div>
    </div>

    <!-- Cards de Visão Geral -->
    <template v-if="carregando">
      <div class="analytics-cards-sk">
        <SkeletonLoader v-for="i in 4" :key="i" tipo="card" />
      </div>
    </template>
    <AnalyticsCards v-else :cards="cards" />

    <!-- Gráficos e Tabela -->
    <template v-if="carregando">
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

    <template v-else-if="crimesFiltrados.length > 0">
      <!-- Linha 1: Evolução temporal (largo) -->
      <div class="graficos-row full">
        <GraficoEvolucao :dados="evolucaoTemporal" />
      </div>

      <!-- Linha 2: Bairros + Tipos -->
      <div class="graficos-row two-cols">
        <GraficoBairros :dados="crimesPorBairro" />
        <GraficoTipos :dados="distribuicaoPorTipo" />
      </div>

      <!-- Linha 3: Dia da semana + Horário -->
      <div class="graficos-row two-cols">
        <GraficoDiaSemana :dados="crimesPorDiaSemana" />
        <GraficoHorario :dados="crimesPorHora" />
      </div>

      <!-- Tabela ranking -->
      <div class="graficos-row full" style="margin-top: 1.5rem;">
        <TabelaRanking :ranking="rankingBairros" />
      </div>
    </template>

    <EmptyState
      v-else
      titulo="Sem dados para o período selecionado"
      descricao="Não há ocorrências registradas neste período. Selecione um intervalo maior."
      icone="mdi mdi-chart-line-variant"
      cor="#8b5cf6"
    />
  </div>
</template>

<script setup lang="ts">
import { useAnalytics } from './composables/useAnalytics'
import { useLoading } from '@/shared/composables/useLoading'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import AnalyticsCards from './components/AnalyticsCards.vue'
import GraficoBairros from './components/GraficoBairros.vue'
import GraficoEvolucao from './components/GraficoEvolucao.vue'
import GraficoTipos from './components/GraficoTipos.vue'
import GraficoDiaSemana from './components/GraficoDiaSemana.vue'
import GraficoHorario from './components/GraficoHorario.vue'
import TabelaRanking from './components/TabelaRanking.vue'
import EmptyState from '@/shared/components/EmptyState.vue'

const {
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
} = useAnalytics()

const { carregando } = useLoading(800)

const periodos = [
  { value: '7d' as const, label: '7 dias' },
  { value: '30d' as const, label: '30 dias' },
  { value: '90d' as const, label: '90 dias' },
  { value: 'all' as const, label: 'Todos' },
]
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
  margin: 0.25rem 0 0 0;
}

.analytics-cards-sk {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.periodo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.periodo-buttons {
  display: flex;
  gap: 0.5rem;
}

.periodo-btn {
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

.periodo-btn:hover {
  background: #334155;
  border-color: #475569;
}

.periodo-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
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

@media (max-width: 900px) {
  .graficos-row.two-cols {
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

  .periodo-section {
    flex-direction: column;
    align-items: stretch;
  }

  .periodo-buttons {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .periodo-btn {
    flex: 1;
    min-width: 70px;
  }
}
</style>
