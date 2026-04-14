<template>
  <div class="analytics-cards">
    <div
      v-for="card in cards"
      :key="card.titulo"
      class="analytics-card"
    >
      <div class="card-icon" :style="{ background: card.cor + '15', color: card.cor }">
        <i :class="card.icone"></i>
      </div>
      <div class="card-content">
        <span class="card-titulo">{{ card.titulo }}</span>
        <span class="card-valor">
          <AnimatedNumber v-if="typeof card.valor === 'number'" :valor="card.valor" />
          <template v-else>{{ card.valor }}</template>
        </span>
        <span v-if="card.subtitulo" class="card-subtitulo">{{ card.subtitulo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import type { AnalyticsCard } from '../types/analytics'
import type { LabelTotal } from '../services/analyticsService'
import { labelNatureza } from '@/features/mapa-crimes/types/crime'

const props = defineProps<{
  total: number
  porNatureza: LabelTotal[]
  porFaixaHoraria: LabelTotal[]
  topCategorias: LabelTotal[]
}>()

function maiorItem(lista: LabelTotal[]): LabelTotal | null {
  if (lista.length === 0) return null

  return [...lista].sort((a, b) => b.total - a.total)[0] || null
}

const cards = computed<AnalyticsCard[]>(() => {
  const naturezaLider = maiorItem(props.porNatureza)
  const faixaPico = maiorItem(props.porFaixaHoraria)
  const categoriaLider = maiorItem(props.topCategorias)

  return [
    {
      titulo: 'Total de Ocorrencias',
      valor: props.total,
      subtitulo: 'no periodo filtrado',
      icone: 'mdi mdi-alert-circle',
      cor: '#3b82f6',
    },
    {
      titulo: 'Natureza Mais Frequente',
      valor: naturezaLider ? labelNatureza(naturezaLider.label) : 'N/A',
      subtitulo: naturezaLider ? `${naturezaLider.total} registros` : 'sem dados',
      icone: 'mdi mdi-shield-alert',
      cor: '#ef4444',
    },
    {
      titulo: 'Faixa Horaria de Pico',
      valor: faixaPico?.label || 'N/A',
      subtitulo: faixaPico ? `${faixaPico.total} registros` : 'sem dados',
      icone: 'mdi mdi-clock-outline',
      cor: '#8b5cf6',
    },
    {
      titulo: 'Top Categoria',
      valor: categoriaLider?.label || 'N/A',
      subtitulo: categoriaLider ? `${categoriaLider.total} registros` : 'sem dados',
      icone: 'mdi mdi-format-list-bulleted-square',
      cor: '#f59e0b',
    },
  ]
})
</script>

<style scoped>
.analytics-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.analytics-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  transition: border-color 0.2s;
}

.analytics-card:hover {
  border-color: #475569;
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.card-titulo {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.card-valor {
  font-size: 1.375rem;
  font-weight: 700;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-subtitulo {
  font-size: 0.6875rem;
  color: #475569;
}

@media (max-width: 768px) {
  .analytics-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .analytics-cards {
    grid-template-columns: 1fr;
  }
}
</style>
