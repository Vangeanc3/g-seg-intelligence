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
        <div class="card-valor-row">
          <span class="card-valor">
            <AnimatedNumber v-if="typeof card.valor === 'number'" :valor="card.valor" />
            <template v-else>{{ card.valor }}</template>
          </span>
          <span
            v-if="card.variacao !== undefined"
            class="card-variacao"
            :class="card.variacao >= 0 ? 'up' : 'down'"
          >
            <i :class="card.variacao >= 0 ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'"></i>
            {{ Math.abs(card.variacao) }}%
          </span>
        </div>
        <span v-if="card.subtitulo" class="card-subtitulo">{{ card.subtitulo }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsCard } from '../types/analytics'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'

defineProps<{
  cards: AnalyticsCard[]
}>()
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

.card-valor-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-valor {
  font-size: 1.375rem;
  font-weight: 700;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-variacao {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.card-variacao.up {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.card-variacao.down {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
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
