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
          <span class="detalhe-label">Natureza</span>
          <span class="detalhe-valor">{{ labelTipo }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Categoria</span>
          <span class="detalhe-valor">{{ crime.properties.categoria }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Data</span>
          <span class="detalhe-valor">{{ formatarDataCrime(crime.properties.dataFato) }}</span>
        </div>

        <div v-if="crime.properties.horaFato" class="detalhe-grupo">
          <span class="detalhe-label">Hora</span>
          <span class="detalhe-valor">{{ crime.properties.horaFato }}</span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Bairro</span>
          <span class="detalhe-valor">{{ crime.properties.bairro }}</span>
        </div>

        <div v-if="mostrarBairroSegup" class="detalhe-grupo">
          <span class="detalhe-label">Bairro (SEGUP)</span>
          <span class="detalhe-valor divergente">
            <i class="mdi mdi-alert-circle"></i>
            {{ crime.properties.bairroSegup }}
          </span>
        </div>

        <div class="detalhe-grupo">
          <span class="detalhe-label">Precisao da Localizacao</span>
          <span
            class="precisao-badge"
            :class="precisaoClass(crime.properties.precisaoCoordenada)"
          >
            {{ labelPrecisaoCoordenada(crime.properties.precisaoCoordenada) }}
          </span>
        </div>

        <div v-if="crime.properties.meioEmpregado" class="detalhe-grupo">
          <span class="detalhe-label">Meio Empregado</span>
          <span class="detalhe-valor">{{ crime.properties.meioEmpregado }}</span>
        </div>

        <div v-if="crime.properties.sexoVitima" class="detalhe-grupo">
          <span class="detalhe-label">Vitima</span>
          <span class="detalhe-valor">
            {{ formatarVitima(crime.properties.sexoVitima, crime.properties.idadeVitima) }}
          </span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import {
  corNatureza,
  formatarDataCrime,
  formatarVitima,
  labelNatureza,
  labelPrecisaoCoordenada,
  normalizarPrecisaoCoordenada,
  type CrimeFeature,
} from '../types/crime'

interface Props {
  crime: CrimeFeature | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ fechar: [] }>()

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.crime) {
    emit('fechar')
  }
}

watch(
  () => props.crime,
  (crime) => {
    if (crime) {
      window.addEventListener('keydown', handleEscape)
    } else {
      window.removeEventListener('keydown', handleEscape)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape)
})

const corTipo = computed(() =>
  props.crime ? corNatureza(props.crime.properties.natureza) : '#6b7280',
)

const labelTipo = computed(() =>
  props.crime ? labelNatureza(props.crime.properties.natureza) : '',
)

const mostrarBairroSegup = computed(() => {
  if (!props.crime?.properties.bairroSegup) {
    return false
  }

  return (
    props.crime.properties.bairroSegup.toUpperCase() !==
    props.crime.properties.bairro.toUpperCase()
  )
})

function precisaoClass(precisao: string): string {
  switch (normalizarPrecisaoCoordenada(precisao)) {
    case 'ALTA':
      return 'precisao-alta'
    case 'MEDIA':
      return 'precisao-media'
    case 'BAIXA':
      return 'precisao-baixa'
  }
}
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

.divergente {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #f59e0b;
  font-size: 0.8125rem;
}

.divergente i {
  font-size: 0.875rem;
}

.precisao-badge {
  display: inline-block;
  width: fit-content;
  padding: 0.1875rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.precisao-alta {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.precisao-media {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.precisao-baixa {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

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
