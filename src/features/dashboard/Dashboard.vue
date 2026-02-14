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
    <StatsCards :stats="stats" />

    <!-- Gráficos -->
    <div class="charts-grid">
      <CrimeChart :data="crimesByDate" />
      <CrimeTypeChart :data="crimesByType" />
    </div>

    <!-- Tabela de Últimas Ocorrências -->
    <RecentCrimes :crimes="recentCrimes" />

    <!-- Loading -->
    <LoadingSpinner v-if="loading" fullscreen text="Carregando dados..." />
  </div>
</template>

<script setup lang="ts">
import StatsCards from './components/StatsCards.vue'
import CrimeChart from './components/CrimeChart.vue'
import CrimeTypeChart from './components/CrimeTypeChart.vue'
import RecentCrimes from './components/RecentCrimes.vue'
import DateFilter from './components/DateFilter.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import { useDashboard } from './composables/useDashboard'

const {
  loading,
  dateFilter,
  stats,
  crimesByDate,
  crimesByType,
  recentCrimes,
  updateDateFilter
} = useDashboard()
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

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
