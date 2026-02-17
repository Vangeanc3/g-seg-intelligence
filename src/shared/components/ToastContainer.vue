<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="toast.tipo"
        >
          <i :class="icone(toast.tipo)" class="toast-icon"></i>
          <span class="toast-msg">{{ toast.mensagem }}</span>
          <button class="toast-fechar" @click="remover(toast.id)">&times;</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToastStore } from '../stores/toastStore'

const store = useToastStore()
const { toasts } = storeToRefs(store)
const { remover } = store

function icone(tipo: string): string {
  const icones: Record<string, string> = {
    success: 'mdi mdi-check-circle',
    error: 'mdi mdi-alert-circle',
    warning: 'mdi mdi-alert',
    info: 'mdi mdi-information',
  }
  return icones[tipo] || icones.info || 'mdi mdi-information'
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 380px;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  font-size: 0.8125rem;
  color: #e2e8f0;
}

.toast.success {
  background: rgba(34, 197, 94, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
}

.toast.success .toast-icon {
  color: #22c55e;
}

.toast.error {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
}

.toast.error .toast-icon {
  color: #ef4444;
}

.toast.warning {
  background: rgba(245, 158, 11, 0.15);
  border-color: rgba(245, 158, 11, 0.3);
}

.toast.warning .toast-icon {
  color: #f59e0b;
}

.toast.info {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.toast.info .toast-icon {
  color: #3b82f6;
}

.toast-icon {
  font-size: 1.125rem;
  flex-shrink: 0;
}

.toast-msg {
  flex: 1;
  line-height: 1.4;
}

.toast-fechar {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.2s;
}

.toast-fechar:hover {
  color: #e2e8f0;
}

/* Animações */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>
