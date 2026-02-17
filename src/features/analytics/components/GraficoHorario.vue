<template>
  <div class="grafico-container">
    <h3 class="grafico-titulo">Crimes por Horário</h3>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Filler, Tooltip)

const props = defineProps<{
  dados: { hora: string; total: number }[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (!chartRef.value) return
  if (chart) chart.destroy()

  const ctx = chartRef.value.getContext('2d')!
  const gradient = ctx.createLinearGradient(0, 0, 0, 250)
  gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
  gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')

  chart = new Chart(chartRef.value, {
    type: 'line',
    data: {
      labels: props.dados.map(d => d.hora),
      datasets: [{
        data: props.dados.map(d => d.total),
        borderColor: '#8b5cf6',
        backgroundColor: gradient,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: '#8b5cf6',
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
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
      scales: {
        x: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { size: 10 }, maxRotation: 0 },
        },
        y: {
          grid: { color: '#1e293b' },
          ticks: { color: '#64748b', font: { size: 11 } },
          beginAtZero: true,
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
  max-height: 250px;
}
</style>
