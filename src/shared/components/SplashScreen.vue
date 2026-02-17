<template>
  <Teleport to="body">
    <transition name="splash-fade">
      <div v-if="visivel" class="splash">
        <div class="splash-content">
          <div class="splash-logo" :class="{ animando }">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
              <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
            </svg>
          </div>
          <h1 class="splash-titulo">G-SEG</h1>
          <p class="splash-sub">Intelligence</p>
          <div class="splash-loader">
            <div class="loader-bar"></div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visivel = ref(true)
const animando = ref(false)

onMounted(() => {
  // Inicia animação do logo
  setTimeout(() => { animando.value = true }, 100)
  // Esconde splash após 1.5s
  setTimeout(() => { visivel.value = false }, 1500)
})
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.splash-logo {
  opacity: 0;
  transform: scale(0.7);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  margin-bottom: 0.5rem;
}

.splash-logo.animando {
  opacity: 1;
  transform: scale(1);
}

.splash-titulo {
  font-size: 2.5rem;
  font-weight: 800;
  color: #e2e8f0;
  margin: 0;
  letter-spacing: 0.05em;
}

.splash-sub {
  font-size: 1rem;
  color: #3b82f6;
  font-weight: 500;
  margin: 0;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.splash-loader {
  width: 120px;
  height: 3px;
  background: #1e293b;
  border-radius: 3px;
  overflow: hidden;
  margin-top: 1.5rem;
}

.loader-bar {
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 3px;
  animation: loading 1.3s ease-out forwards;
}

@keyframes loading {
  0% { width: 0; }
  70% { width: 85%; }
  100% { width: 100%; }
}

/* Fade out */
.splash-fade-leave-active {
  transition: opacity 0.4s ease;
}

.splash-fade-leave-to {
  opacity: 0;
}
</style>
