<template>
  <div class="legenda">
    <div v-for="(cor, tipo) in cores" :key="tipo" class="legenda-item">
      <span class="legenda-cor" :style="{ background: cor }"></span>
      <span class="legenda-label">{{ labels[tipo as TipoCrime] }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TipoCrime } from '../types/crime'
import { CRIME_CORES, CRIME_LABELS } from '../types/crime'

const cores = CRIME_CORES
const labels = CRIME_LABELS
</script>

<style scoped>
.legenda {
  position: absolute;
  bottom: 2rem;
  right: 1rem;
  background: #1e293bdd;
  backdrop-filter: blur(8px);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  z-index: 10;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legenda-cor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legenda-label {
  color: #cbd5e1;
  font-size: 0.75rem;
}
</style>
