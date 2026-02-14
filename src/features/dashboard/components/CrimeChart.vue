<template>
  <BaseCard>
    <template #header>
      <h3>Crimes ao Longo do Tempo</h3>
    </template>
    <div class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import BaseCard from '@/shared/components/BaseCard.vue'
import type { CrimeByDate } from '../types/dashboard'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface Props {
  data: CrimeByDate[]
}

const props = defineProps<Props>()

const chartData = computed(() => ({
  labels: props.data.map(d => {
    const date = new Date(d.date)
    return `${date.getDate()}/${date.getMonth() + 1}`
  }),
  datasets: [
    {
      label: 'Crimes',
      data: props.data.map(d => d.count),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6
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
  },
  scales: {
    x: {
      grid: {
        color: '#334155',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8'
      }
    },
    y: {
      grid: {
        color: '#334155',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8'
      }
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
  height: 300px;
  padding: 1rem 0;
}
</style>
