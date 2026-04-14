<template>
  <div class="legenda">
    <template v-if="visualizacao === 'ocorrencias'">
      <div v-for="item in itensNatureza" :key="item.tipo" class="legenda-item">
        <span class="legenda-cor" :style="{ background: item.cor }"></span>
        <span class="legenda-label">{{ item.label }}</span>
      </div>
    </template>

    <template v-else-if="visualizacao === 'risco-bairros'">
      <h4 class="legenda-titulo">Nivel de Risco</h4>
      <div v-for="item in itensRisco" :key="item.nivel" class="legenda-item">
        <span class="legenda-cor" :style="{ background: item.cor }"></span>
        <span class="legenda-label">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { CRIME_CORES, labelNatureza, type VisualizacaoMapa } from '../types/crime'
import { RISCO_CORES, RISCO_LABELS, type NivelRisco } from '../services/riscoService'

defineProps<{
  visualizacao: VisualizacaoMapa
}>()

const itensNatureza = Object.entries(CRIME_CORES).map(([tipo, cor]) => ({
  tipo,
  cor,
  label: labelNatureza(tipo),
}))

const niveis: NivelRisco[] = ['Seguro', 'Baixo', 'Medio', 'Alto', 'Critico']

const itensRisco = niveis.map((nivel) => ({
  nivel,
  cor: RISCO_CORES[nivel],
  label: RISCO_LABELS[nivel],
}))
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

.legenda-titulo {
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
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
