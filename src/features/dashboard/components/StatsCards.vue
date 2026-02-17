<template>
  <div class="stats-grid">
    <BaseCard v-for="stat in statsData" :key="stat.id" variant="default">
      <div class="stat-card">
        <div class="stat-icon" :style="{ background: stat.color + '20', color: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-content">
          <p class="stat-label">{{ stat.label }}</p>
          <h3 class="stat-value">
            <AnimatedNumber :valor="stat.rawValue" />{{ stat.suffix }}
          </h3>
          <div class="stat-change" :class="stat.changeType">
            <i :class="stat.changeIcon"></i>
            <span>{{ stat.change }}</span>
          </div>
        </div>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '@/shared/components/BaseCard.vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import type { DashboardStats } from '../types/dashboard'

interface Props {
  stats: DashboardStats
}

const props = defineProps<Props>()

const statsData = computed(() => [
  {
    id: '1',
    label: 'Total de Crimes',
    rawValue: props.stats.totalCrimes,
    suffix: '',
    change: `${props.stats.changePercent.totalCrimes > 0 ? '+' : ''}${props.stats.changePercent.totalCrimes}% vs mês anterior`,
    changeType: props.stats.changePercent.totalCrimes > 0 ? 'negative' : 'positive',
    changeIcon: props.stats.changePercent.totalCrimes > 0 ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down',
    icon: 'mdi mdi-alert-circle',
    color: '#ef4444'
  },
  {
    id: '2',
    label: 'Casos Solucionados',
    rawValue: props.stats.solvedCases,
    suffix: '',
    change: `+${props.stats.changePercent.solvedCases}% vs mês anterior`,
    changeType: 'positive',
    changeIcon: 'mdi mdi-arrow-up',
    icon: 'mdi mdi-check-circle',
    color: '#22c55e'
  },
  {
    id: '3',
    label: 'Em Investigação',
    rawValue: props.stats.investigating,
    suffix: '',
    change: props.stats.changePercent.investigating === 0 ? 'Sem alteração' : `${props.stats.changePercent.investigating}%`,
    changeType: 'neutral',
    changeIcon: 'mdi mdi-minus',
    icon: 'mdi mdi-clock-outline',
    color: '#f59e0b'
  },
  {
    id: '4',
    label: 'Taxa de Resolução',
    rawValue: props.stats.resolutionRate,
    suffix: '%',
    change: `+${props.stats.changePercent.resolutionRate}% vs mês anterior`,
    changeType: 'positive',
    changeIcon: 'mdi mdi-arrow-up',
    icon: 'mdi mdi-chart-line',
    color: '#3b82f6'
  }
])
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-icon i {
  font-size: 2rem;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  margin: 0.25rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #22c55e;
}

.stat-change.negative {
  color: #ef4444;
}

.stat-change.neutral {
  color: #94a3b8;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
