<template>
  <div class="grafico-container">
    <h3 class="grafico-titulo">Distribuicao por Natureza</h3>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import type { LabelTotal } from '../services/analyticsService'
import { corNatureza, labelNatureza } from '@/features/mapa-crimes/types/crime'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  dados: LabelTotal[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (!chartRef.value) return
  if (chart) chart.destroy()

  chart = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: props.dados.map((item) => labelNatureza(item.label)),
      datasets: [
        {
          data: props.dados.map((item) => item.total),
          backgroundColor: props.dados.map((item) => corNatureza(item.label)),
          borderColor: '#1e293b',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            padding: 16,
            font: { size: 12 },
            usePointStyle: true,
            pointStyleWidth: 12,
          },
        },
        tooltip: {
          backgroundColor: '#1e293b',
          borderColor: '#334155',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#94a3b8',
          padding: 10,
          cornerRadius: 8,
        },
      },
    },
  })
}

onMounted(renderChart)
watch(() => props.dados, renderChart, { deep: true })
onBeforeUnmount(() => chart?.destroy())
</script>

<style scoped>
.grafico-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.25rem;
  height: 100%;
}

.grafico-titulo {
  color: #e2e8f0;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

canvas {
  max-height: 280px;
}
</style>
