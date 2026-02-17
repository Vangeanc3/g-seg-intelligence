<template>
  <div class="filtros">
    <h3>Filtros</h3>

    <!-- Skeleton enquanto carrega -->
    <template v-if="carregando">
      <SkeletonLoader tipo="texto" :linhas="3" />
      <SkeletonLoader tipo="texto" :linhas="5" />
      <SkeletonLoader tipo="texto" :linhas="2" />
      <SkeletonLoader tipo="texto" :linhas="4" />
    </template>

    <template v-else>

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

    <!-- Período -->
    <div class="filtro-grupo">
      <label>Período</label>
      <div class="periodo-grid">
        <button
          v-for="opt in periodoOpts"
          :key="opt.value"
          :class="['btn-periodo', { active: periodoAtivo === opt.value }]"
          @click="selecionarPeriodo(opt.value)"
        >
          {{ opt.label }}
        </button>
      </div>
      <div class="date-inputs">
        <input
          type="date"
          class="input-date"
          :value="dataInicio"
          @input="$emit('update:dataInicio', ($event.target as HTMLInputElement).value)"
        />
        <input
          type="date"
          class="input-date"
          :value="dataFim"
          @input="$emit('update:dataFim', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="stats-mini">
      <div class="stat">
        <span class="stat-num"><AnimatedNumber :valor="total" :duracao="500" /></span>
        <span class="stat-label">ocorrências</span>
      </div>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-if="total === 0"
      titulo="Nenhuma ocorrência encontrada"
      descricao="Tente ajustar os filtros de período, tipo ou bairro para ver resultados."
      icone="mdi mdi-map-marker-off"
      cor="#f59e0b"
    >
      <template #acao>
        <button class="btn-limpar-filtros" @click="$emit('limpar')">
          <i class="mdi mdi-filter-remove"></i>
          Limpar Filtros
        </button>
      </template>
    </EmptyState>

    <!-- Limpar -->
    <button class="btn-limpar" @click="$emit('limpar')">
      <i class="mdi mdi-filter-remove"></i>
      Limpar filtros
    </button>

    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TipoCrime } from '../types/crime'
import { CRIME_CORES, CRIME_LABELS } from '../types/crime'
import { useLoading } from '@/shared/composables/useLoading'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import EmptyState from '@/shared/components/EmptyState.vue'

interface Props {
  visualizacao: string
  tiposSelecionados: TipoCrime[]
  bairros: string[]
  total: number
  estatisticas: { porTipo: [string, number][] }
  dataInicio: string
  dataFim: string
}

const props = defineProps<Props>()

const { carregando } = useLoading(600)

const emit = defineEmits<{
  'update:visualizacao': [value: string]
  'update:dataInicio': [value: string]
  'update:dataFim': [value: string]
  toggleTipo: [tipo: TipoCrime]
  filtrarBairro: [bairro: string]
  limpar: []
}>()

const visualizacaoOpts = [
  { value: 'pontos', label: 'Pontos', icon: 'mdi mdi-map-marker' },
  { value: 'heatmap', label: 'Calor', icon: 'mdi mdi-fire' },
  { value: 'clusters', label: 'Clusters', icon: 'mdi mdi-circle-multiple' },
]

const periodoOpts = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'all', label: 'Todos' },
]

const tiposCrime = computed(() =>
  Object.entries(CRIME_LABELS).map(([value, label]) => ({
    value: value as TipoCrime,
    label,
    cor: CRIME_CORES[value as TipoCrime],
    count: props.estatisticas.porTipo.find(([t]) => t === value)?.[1] || 0,
  }))
)

const periodoAtivo = computed(() => {
  if (!props.dataInicio && !props.dataFim) return 'all'

  const hoje = new Date()
  const inicio = props.dataInicio ? new Date(props.dataInicio) : null
  const fim = props.dataFim ? new Date(props.dataFim) : null

  if (!inicio || !fim) return null

  const diffDays = Math.ceil((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays <= 7 && diffDays >= 6) return '7d'
  if (diffDays <= 30 && diffDays >= 29) return '30d'
  if (diffDays <= 90 && diffDays >= 89) return '90d'

  return null
})

function selecionarPeriodo(periodo: string) {
  const hoje = new Date()
  const dataFimFormatada = hoje.toISOString().split('T')[0]!

  if (periodo === 'all') {
    emit('update:dataInicio', '')
    emit('update:dataFim', '')
    return
  }

  const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
  const dataInicio = new Date(hoje)
  dataInicio.setDate(dataInicio.getDate() - dias)
  const dataInicioFormatada = dataInicio.toISOString().split('T')[0]!

  emit('update:dataInicio', dataInicioFormatada)
  emit('update:dataFim', dataFimFormatada)
}
</script>

<style scoped>
.filtros {
  background: #1e293b;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  height: 100%;
  overflow-y: auto;
}

.filtros::-webkit-scrollbar {
  width: 4px;
}

.filtros::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1rem;
}

.filtro-grupo label {
  display: block;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.4rem;
}

.btn-group {
  display: flex;
  gap: 0.25rem;
}

.btn-vis {
  flex: 1;
  padding: 0.4rem 0.25rem;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.btn-vis i {
  font-size: 0.9rem;
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
  padding: 0.4rem 0.6rem;
  border: 1px solid #334155;
  background: transparent;
  color: #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
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
  padding: 0.4rem 0.6rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 6px;
  font-size: 0.75rem;
}

.periodo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
}

.btn-periodo {
  padding: 0.4rem 0.5rem;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.7rem;
  transition: all 0.2s;
}

.btn-periodo.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.stats-mini {
  background: #0f172a;
  border-radius: 6px;
  padding: 0.6rem;
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  color: #64748b;
  font-size: 0.7rem;
}

.input-date {
  width: 100%;
  padding: 0.4rem 0.5rem;
  border: 1px solid #334155;
  background: #0f172a;
  color: #e2e8f0;
  border-radius: 6px;
  font-size: 0.7rem;
}

.input-date::-webkit-calendar-picker-indicator {
  filter: invert(0.7);
  cursor: pointer;
}

.btn-limpar {
  padding: 0.4rem;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s;
}

.btn-limpar:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-limpar-filtros {
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #3b82f6;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-limpar-filtros:hover {
  background: rgba(59, 130, 246, 0.2);
}
</style>
