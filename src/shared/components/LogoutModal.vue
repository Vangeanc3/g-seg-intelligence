<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="visivel" class="modal-overlay" @click.self="$emit('cancelar')">
        <transition name="modal-scale">
          <div v-if="visivel" class="modal-box">
            <div class="modal-icon">
              <i class="mdi mdi-logout-variant"></i>
            </div>
            <h2 class="modal-titulo">Sair da plataforma?</h2>
            <p class="modal-desc">
              Você será desconectado e redirecionado para a página inicial.
            </p>
            <div class="modal-actions">
              <button class="btn-cancelar" @click="$emit('cancelar')">
                Cancelar
              </button>
              <button class="btn-sair" @click="$emit('confirmar')">
                <i class="mdi mdi-logout"></i>
                Sair
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps<{ visivel: boolean }>()
const emit = defineEmits<{ cancelar: []; confirmar: [] }>()

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('cancelar')
}

watch(() => props.visivel, (v) => {
  if (v) document.addEventListener('keydown', onKeydown)
  else document.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2rem;
  max-width: 380px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}

.modal-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.modal-desc {
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1.5rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-cancelar {
  flex: 1;
  padding: 0.625rem;
  background: transparent;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar:hover {
  border-color: #94a3b8;
  color: #e2e8f0;
}

.btn-sair {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem;
  background: #ef4444;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-sair:hover {
  background: #dc2626;
}

/* Animações */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-scale-leave-active {
  transition: all 0.15s ease;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
