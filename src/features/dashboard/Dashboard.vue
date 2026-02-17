<template>
  <div class="dashboard">
    <!-- Cabeçalho com filtro -->
    <div class="dashboard-header">
      <div>
        <h1>Dashboard - Belém/PA</h1>
        <p class="subtitle">Visão geral da criminalidade</p>
      </div>
      <DateFilter v-model="dateFilter" @update:model-value="updateDateFilter" />
    </div>

    <!-- Cards de Estatísticas -->
    <div v-if="carregando" class="stats-grid-sk">
      <SkeletonLoader v-for="i in 4" :key="i" tipo="card" />
    </div>
    <StatsCards v-else :stats="stats" />

    <!-- Gráficos -->
    <template v-if="carregando">
      <div class="charts-grid">
        <SkeletonLoader tipo="grafico" />
        <SkeletonLoader tipo="grafico" />
      </div>
    </template>
    <template v-else>
      <div class="charts-grid">
        <CrimeChart :data="crimesByDate" />
        <CrimeTypeChart :data="crimesByType" />
      </div>
    </template>

    <!-- Tabela de Últimas Ocorrências -->
    <SkeletonLoader v-if="carregando" tipo="tabela" :linhas="5" />
    <RecentCrimes v-else :crimes="recentCrimes" />

    <!-- Comparativo Temporal -->
    <SkeletonLoader v-if="carregando" tipo="tabela" :linhas="6" />
    <ComparativoTemporal v-else />
  </div>
</template>

<script setup lang="ts">
import StatsCards from './components/StatsCards.vue'
import CrimeChart from './components/CrimeChart.vue'
import CrimeTypeChart from './components/CrimeTypeChart.vue'
import RecentCrimes from './components/RecentCrimes.vue'
import ComparativoTemporal from './components/ComparativoTemporal.vue'
import DateFilter from './components/DateFilter.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import { useDashboard } from './composables/useDashboard'
import { useLoading } from '@/shared/composables/useLoading'

const {
  dateFilter,
  stats,
  crimesByDate,
  crimesByType,
  recentCrimes,
  updateDateFilter
} = useDashboard()

const { carregando } = useLoading(1000)
</script>

<style scoped>
.dashboard {
  color: white;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0;
  color: #94a3b8;
  font-size: 1rem;
}

.stats-grid-sk {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }

  .dashboard-header h1 {
    font-size: 1.5rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid-sk {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid-sk {
    grid-template-columns: 1fr;
  }
}
</style>
