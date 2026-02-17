<template>
  <div class="grafico-container">
    <h3 class="grafico-titulo">Crimes por Dia da Semana</h3>
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

const props = defineProps<{
  dados: { dia: string; total: number }[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

function renderChart() {
  if (!chartRef.value) return
  if (chart) chart.destroy()

  const cores = props.dados.map(d => {
    const max = Math.max(...props.dados.map(x => x.total))
    const intensidade = d.total / max
    return `rgba(59, 130, 246, ${0.3 + intensidade * 0.7})`
  })

  chart = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: props.dados.map(d => d.dia),
      datasets: [{
        data: props.dados.map(d => d.total),
        backgroundColor: cores,
        borderRadius: 6,
        barThickness: 32,
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
          grid: { display: false },
          ticks: { color: '#94a3b8', font: { size: 12 } },
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
