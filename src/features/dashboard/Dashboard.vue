<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1>Dashboard - Belem/PA</h1>
        <p class="subtitle">Visao geral da criminalidade</p>
      </div>
      <DateFilter
        :model-value="dateFilter"
        @update:model-value="updateDateFilter"
      />
    </div>

    <div v-if="erro" class="dashboard-feedback">
      <ErrorMessage :message="erro" />
      <BaseButton variant="secondary" @click="recarregar">
        Tentar novamente
      </BaseButton>
    </div>

    <template v-else-if="carregando">
      <div class="stats-grid-sk">
        <SkeletonLoader v-for="i in 4" :key="i" tipo="card" />
      </div>

      <div class="charts-grid">
        <SkeletonLoader tipo="grafico" />
        <SkeletonLoader tipo="grafico" />
      </div>

      <SkeletonLoader tipo="tabela" :linhas="5" />
      <SkeletonLoader tipo="tabela" :linhas="6" />
    </template>

    <div v-else-if="!analytics" class="dashboard-empty">
      <EmptyState
        titulo="Sem dados no dashboard"
        descricao="Nao foi possivel montar os indicadores com os dados atuais."
        icone="mdi mdi-chart-box-outline"
      />
    </div>

    <template v-else>
      <StatsCards
        :total="totalCrimes"
        :tipo-mais-frequente="tipoMaisFrequente"
        :faixa-pico="faixaPico"
        :categoria-top="categoriaTop"
      />

      <div class="charts-grid">
        <CrimeChart :data="crimesByDate" />
        <CrimeTypeChart :data="crimesByType" />
      </div>

      <RecentCrimes :crimes="crimesRecentes" />
      <ComparativoTemporal />
    </template>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DashboardPage',
})

import DateFilter from './components/DateFilter.vue'
import StatsCards from './components/StatsCards.vue'
import CrimeChart from './components/CrimeChart.vue'
import CrimeTypeChart from './components/CrimeTypeChart.vue'
import RecentCrimes from './components/RecentCrimes.vue'
import ComparativoTemporal from './components/ComparativoTemporal.vue'
import BaseButton from '@/shared/components/BaseButton.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import { useDashboard } from './composables/useDashboard'

const {
  analytics,
  dateFilter,
  crimesRecentes,
  totalCrimes,
  tipoMaisFrequente,
  faixaPico,
  categoriaTop,
  crimesByDate,
  crimesByType,
  carregando,
  erro,
  updateDateFilter,
  recarregar,
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

.stats-grid-sk {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 0;
}

.dashboard-feedback,
.dashboard-empty {
  margin-bottom: 2rem;
}

.dashboard-feedback {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
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
