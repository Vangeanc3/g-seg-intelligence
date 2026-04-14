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
            <AnimatedNumber v-if="typeof stat.rawValue === 'number'" :valor="stat.rawValue" />
            <template v-else>{{ stat.rawValue }}</template>
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

const props = defineProps<{
  total: number
  tipoMaisFrequente: { nome: string; total: number } | null
  faixaPico: { label: string; total: number }
  categoriaTop: { nome: string; total: number } | null
}>()

const statsData = computed(() => [
  {
    id: '1',
    label: 'Total de Ocorrencias',
    rawValue: props.total,
    change: 'volume total no periodo',
    changeType: 'neutral',
    changeIcon: 'mdi mdi-chart-bar',
    icon: 'mdi mdi-alert-circle',
    color: '#ef4444',
  },
  {
    id: '2',
    label: 'Tipo Mais Frequente',
    rawValue: props.tipoMaisFrequente?.nome || 'N/A',
    change: props.tipoMaisFrequente
      ? `${props.tipoMaisFrequente.total} registros`
      : 'sem dados',
    changeType: 'neutral',
    changeIcon: 'mdi mdi-shield-alert',
    icon: 'mdi mdi-shield-alert',
    color: '#f59e0b',
  },
  {
    id: '3',
    label: 'Horario de Pico',
    rawValue: props.faixaPico.label,
    change: props.faixaPico.total > 0
      ? `${props.faixaPico.total} registros`
      : 'sem dados',
    changeType: 'neutral',
    changeIcon: 'mdi mdi-clock-outline',
    icon: 'mdi mdi-clock-outline',
    color: '#8b5cf6',
  },
  {
    id: '4',
    label: 'Categoria Top',
    rawValue: props.categoriaTop?.nome || 'N/A',
    change: props.categoriaTop
      ? `${props.categoriaTop.total} registros`
      : 'sem dados',
    changeType: 'neutral',
    changeIcon: 'mdi mdi-format-list-bulleted-square',
    icon: 'mdi mdi-format-list-bulleted-square',
    color: '#3b82f6',
  },
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
  min-width: 0;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
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
