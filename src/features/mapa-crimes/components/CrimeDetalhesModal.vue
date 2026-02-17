<template>
  <transition name="slide">
    <div v-if="crime" class="crime-modal">
      <div class="modal-header">
        <div class="crime-tipo" :style="{ color: corTipo }">
          <span class="tipo-badge" :style="{ background: corTipo + '20', border: '1px solid ' + corTipo }">
            {{ labelTipo }}
          </span>
        </div>
        <button class="btn-fechar" @click="$emit('fechar')">&times;</button>
      </div>

      <div class="modal-body">
        <div class="detalhe-grupo">
          <span class="detalhe-label">Endereço</span>
          <span class="detalhe-valor">{{ crime.endereco }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Bairro</span>
          <span class="detalhe-valor">{{ crime.bairro }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Data</span>
          <span class="detalhe-valor">{{ dataFormatada }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Status</span>
          <span class="status-badge" :style="{ color: corStatus, background: corStatus + '20' }">
            {{ statusLabel }}
          </span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Descrição</span>
          <span class="detalhe-valor descricao">{{ crime.descricao }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">ID</span>
          <span class="detalhe-valor id-text">{{ crime.id }}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue'
import type { Crime } from '../types/crime'
import { CRIME_CORES, CRIME_LABELS } from '../types/crime'

interface Props {
  crime: Crime | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ fechar: [] }>()

// Fechar com tecla ESC
function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.crime) {
    emit('fechar')
  }
}

watch(() => props.crime, (crime) => {
  if (crime) {
    window.addEventListener('keydown', handleEscape)
  } else {
    window.removeEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})

const corTipo = computed(() => props.crime ? CRIME_CORES[props.crime.tipo] : '#6b7280')
const labelTipo = computed(() => props.crime ? CRIME_LABELS[props.crime.tipo] : '')

const dataFormatada = computed(() => {
  if (!props.crime) return ''
  return new Date(props.crime.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const corStatus = computed(() => {
  if (!props.crime) return '#6b7280'
  const cores: Record<string, string> = {
    solucionado: '#22c55e',
    em_investigacao: '#f59e0b',
    aberto: '#ef4444',
  }
  return cores[props.crime.status] || '#6b7280'
})

const statusLabel = computed(() => {
  if (!props.crime) return ''
  const labels: Record<string, string> = {
    solucionado: 'Solucionado',
    em_investigacao: 'Em investigação',
    aberto: 'Aberto',
  }
  return labels[props.crime.status] || props.crime.status
})
</script>

<style scoped>
.crime-modal {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 320px;
  max-height: calc(100% - 2rem);
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  z-index: 20;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.crime-modal::-webkit-scrollbar {
  width: 4px;
}

.crime-modal::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1rem 0.75rem;
  border-bottom: 1px solid #334155;
}

.tipo-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
}

.btn-fechar {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}

.btn-fechar:hover {
  color: #e2e8f0;
}

.modal-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detalhe-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detalhe-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detalhe-valor {
  font-size: 0.875rem;
  color: #e2e8f0;
}

.descricao {
  color: #94a3b8;
  line-height: 1.5;
}

.id-text {
  font-family: monospace;
  color: #64748b;
  font-size: 0.75rem;
}

.status-badge {
  display: inline-block;
  width: fit-content;
  padding: 0.25rem 0.625rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
}

/* Animação slide-in */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .crime-modal {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 60vh;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.4);
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateY(100%);
  }
}
</style>
