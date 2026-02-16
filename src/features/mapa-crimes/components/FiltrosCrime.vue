<template>
  <div class="filtros">
    <h3>Filtros</h3>

    <!-- Visualização -->
    <div class="filtro-grupo">
      <label>Visualização</label>
      <div class="btn-group">
        <button
          v-for="opt in visualizacaoOpts"
          :key="opt.value"
          :class="['btn-vis', { active: visualizacao === opt.value }]"
          @click="$emit('update:visualizacao', opt.value)"
        >
          <i :class="opt.icon"></i>
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Tipos de crime -->
    <div class="filtro-grupo">
      <label>Tipo de Crime</label>
      <div class="tipo-list">
        <button
          v-for="tipo in tiposCrime"
          :key="tipo.value"
          :class="['btn-tipo', { active: tiposSelecionados.includes(tipo.value) }]"
          @click="$emit('toggleTipo', tipo.value)"
        >
          <span class="tipo-cor" :style="{ background: tipo.cor }"></span>
          {{ tipo.label }}
          <span v-if="tipo.count" class="tipo-count">{{ tipo.count }}</span>
        </button>
      </div>
    </div>

    <!-- Bairros -->
    <div class="filtro-grupo">
      <label>Bairro</label>
      <select
        class="select-bairro"
        @change="$emit('filtrarBairro', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Todos os bairros</option>
        <option v-for="b in bairros" :key="b" :value="b">{{ b }}</option>
      </select>
    </div>

    <!-- Estatísticas -->
    <div class="stats-mini">
      <div class="stat">
        <span class="stat-num">{{ total }}</span>
        <span class="stat-label">ocorrências</span>
      </div>
    </div>

    <!-- Limpar -->
    <button class="btn-limpar" @click="$emit('limpar')">
      <i class="mdi mdi-filter-remove"></i>
      Limpar filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TipoCrime } from '../types/crime'
import { CRIME_CORES, CRIME_LABELS } from '../types/crime'

interface Props {
  visualizacao: string
  tiposSelecionados: TipoCrime[]
  bairros: string[]
  total: number
  estatisticas: { porTipo: [string, number][] }
}

const props = defineProps<Props>()

defineEmits<{
  'update:visualizacao': [value: string]
  toggleTipo: [tipo: TipoCrime]
  filtrarBairro: [bairro: string]
  limpar: []
}>()

const visualizacaoOpts = [
  { value: 'pontos', label: 'Pontos', icon: 'mdi mdi-map-marker' },
  { value: 'heatmap', label: 'Calor', icon: 'mdi mdi-fire' },
  { value: 'clusters', label: 'Clusters', icon: 'mdi mdi-circle-multiple' },
]

const tiposCrime = Object.entries(CRIME_LABELS).map(([value, label]) => ({
  value: value as TipoCrime,
  label,
  cor: CRIME_CORES[value as TipoCrime],
  count: props.estatisticas.porTipo.find(([t]) => t === value)?.[1] || 0,
}))
</script>

<style scoped>
.filtros {
  background: #1e293b;
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.125rem;
}

.filtro-grupo label {
  display: block;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.btn-group {
  display: flex;
  gap: 0.25rem;
}

.btn-vis {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.btn-vis.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.tipo-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn-tipo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #334155;
  background: transparent;
  color: #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8125rem;
  transition: all 0.2s;
}

.btn-tipo.active {
  border-color: #3b82f6;
  background: #3b82f620;
}

.tipo-cor {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.tipo-count {
  margin-left: auto;
  color: #64748b;
  font-size: 0.75rem;
}

.select-bairro {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 6px;
  font-size: 0.8125rem;
}

.stats-mini {
  background: #0f172a;
  border-radius: 6px;
  padding: 0.75rem;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  color: #64748b;
  font-size: 0.75rem;
}

.btn-limpar {
  padding: 0.5rem;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-limpar:hover {
  border-color: #ef4444;
  color: #ef4444;
}
</style>
