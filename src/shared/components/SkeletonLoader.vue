<template>
  <div class="skeleton" :class="tipo">
    <div v-if="tipo === 'card'" class="sk-card">
      <div class="sk-line sk-icon"></div>
      <div class="sk-content">
        <div class="sk-line sk-title"></div>
        <div class="sk-line sk-value"></div>
        <div class="sk-line sk-subtitle"></div>
      </div>
    </div>

    <div v-else-if="tipo === 'grafico'" class="sk-grafico">
      <div class="sk-line sk-grafico-title"></div>
      <div class="sk-grafico-area"></div>
    </div>

    <div v-else-if="tipo === 'tabela'" class="sk-tabela">
      <div class="sk-line sk-tabela-header"></div>
      <div v-for="i in linhas" :key="i" class="sk-line sk-tabela-row"></div>
    </div>

    <div v-else-if="tipo === 'texto'" class="sk-texto">
      <div
        v-for="i in linhas"
        :key="i"
        class="sk-line sk-text-line"
        :style="{ width: widths[i - 1] }"
      ></div>
    </div>

    <slot v-else></slot>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  tipo?: 'card' | 'grafico' | 'tabela' | 'texto' | 'custom'
  linhas?: number
}>(), {
  tipo: 'texto',
  linhas: 4,
})

// Gerar larguras aleatórias uma vez (evita re-render instável)
const widths = Array.from({ length: props.linhas }, () =>
  (60 + Math.random() * 40).toFixed(1) + '%'
)
</script>

<style scoped>
.skeleton {
  width: 100%;
}

/* Animação shimmer */
.sk-line {
  background: linear-gradient(90deg, #1e293b 25%, #2a3a50 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 6px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Card skeleton */
.sk-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
}

.sk-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  flex-shrink: 0;
}

.sk-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.125rem;
}

.sk-title {
  height: 10px;
  width: 60%;
}

.sk-value {
  height: 22px;
  width: 40%;
}

.sk-subtitle {
  height: 8px;
  width: 50%;
}

/* Gráfico skeleton */
.sk-grafico {
  padding: 1.25rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.sk-grafico-title {
  height: 14px;
  width: 35%;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.sk-grafico-area {
  flex: 1;
  min-height: 200px;
  background: linear-gradient(90deg, #1e293b 25%, #2a3a50 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite ease-in-out;
  border-radius: 8px;
}

/* Tabela skeleton */
.sk-tabela {
  padding: 1.25rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sk-tabela-header {
  height: 14px;
  width: 100%;
  opacity: 0.5;
  margin-bottom: 0.25rem;
}

.sk-tabela-row {
  height: 40px;
  width: 100%;
}

/* Texto skeleton */
.sk-texto {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.sk-text-line {
  height: 12px;
}
</style>
