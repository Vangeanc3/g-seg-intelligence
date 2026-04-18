<template>
  <div class="precisao-container">
    <h3 class="precisao-titulo">Qualidade dos Dados</h3>

    <div class="precisao-grid">
      <div class="precisao-card principal">
        <div
          class="card-icon"
          :style="{
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#22c55e',
          }"
        >
          <i class="mdi mdi-check-decagram"></i>
        </div>
        <div class="card-info">
          <span class="card-label">Dados Precisos</span>
          <span class="card-valor">
            <AnimatedNumber :valor="percentualPreciso" />%
          </span>
        </div>
      </div>

      <div class="precisao-card">
        <div class="card-dot" style="background: #22c55e;"></div>
        <div class="card-info">
          <span class="card-label">Precisao Alta</span>
          <span class="card-valor">
            <AnimatedNumber :valor="precisao.alta" />
          </span>
        </div>
      </div>

      <div class="precisao-card">
        <div class="card-dot" style="background: #f59e0b;"></div>
        <div class="card-info">
          <span class="card-label">Aproximada</span>
          <span class="card-valor">
            <AnimatedNumber :valor="precisao.media" />
          </span>
        </div>
      </div>

      <div class="precisao-card">
        <div class="card-dot" style="background: #ef4444;"></div>
        <div class="card-info">
          <span class="card-label">Imprecisa</span>
          <span class="card-valor">
            <AnimatedNumber :valor="precisao.baixa" />
          </span>
        </div>
      </div>
    </div>

    <div class="distribuicao-barra">
      <div
        class="barra-segmento alta"
        :style="{ width: percentual(precisao.alta) + '%' }"
        :title="'Alta: ' + precisao.alta"
      ></div>
      <div
        class="barra-segmento media"
        :style="{ width: percentual(precisao.media) + '%' }"
        :title="'Media: ' + precisao.media"
      ></div>
      <div
        class="barra-segmento baixa"
        :style="{ width: percentual(precisao.baixa) + '%' }"
        :title="'Baixa: ' + precisao.baixa"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import type { PrecisaoResumo } from '@/features/analytics/services/analyticsService'

const props = defineProps<{
  precisao: PrecisaoResumo
}>()

const total = computed(
  () => props.precisao.alta + props.precisao.media + props.precisao.baixa,
)
const percentualPreciso = computed(() =>
  Math.round(props.precisao.percentualPreciso),
)

function percentual(valor: number): number {
  return total.value > 0 ? Math.round((valor / total.value) * 100) : 0
}
</script>

<style scoped>
.precisao-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.precisao-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1rem;
}

.precisao-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.precisao-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  min-width: 0;
}

.precisao-card.principal {
  border-color: rgba(34, 197, 94, 0.3);
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.card-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.card-label {
  font-size: 0.6875rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.card-valor {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
}

.principal .card-valor {
  color: #22c55e;
}

.distribuicao-barra {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  background: #0f172a;
}

.barra-segmento {
  transition: width 0.5s ease;
  min-width: 2px;
}

.barra-segmento.alta {
  background: #22c55e;
}

.barra-segmento.media {
  background: #f59e0b;
}

.barra-segmento.baixa {
  background: #ef4444;
}

@media (max-width: 768px) {
  .precisao-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .precisao-grid {
    grid-template-columns: 1fr;
  }
}
</style>
