<template>
  <BaseCard>
    <template #header>
      <h3>Crimes por Tipo</h3>
    </template>
    <div class="chart-container">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div class="legend">
      <div v-for="item in data" :key="item.type" class="legend-item">
        <div class="legend-color" :style="{ background: item.color }"></div>
        <span class="legend-label">{{ item.type }}</span>
        <span class="legend-value">{{ item.count }} ({{ item.percentage }}%)</span>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import BaseCard from '@/shared/components/BaseCard.vue'
import type { CrimeByType } from '../types/dashboard'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  data: CrimeByType[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.data.map(d => d.type),
  datasets: [
    {
      data: props.data.map(d => d.count),
      backgroundColor: props.data.map(d => d.color),
      borderColor: '#1e293b',
      borderWidth: 2
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#e2e8f0',
      bodyColor: '#e2e8f0',
      borderColor: '#334155',
      borderWidth: 1
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.125rem;
}

.chart-container {
  height: 250px;
  padding: 1rem;
  display: flex;
  justify-content: center;
}

.legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #334155;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.legend-value {
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
