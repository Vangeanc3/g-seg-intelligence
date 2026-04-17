<template>
  <div class="filtros">
    <div class="filtros-header">
      <h3>Filtros</h3>
      <div v-if="carregando" class="filtros-status">
        <LoadingSpinner size="sm" text="Atualizando..." />
      </div>
    </div>

    <div class="filtro-grupo">
      <label>Visualizacao</label>
      <div class="btn-group">
        <button
          v-for="opt in visualizacoes"
          :key="opt.id"
          type="button"
          :class="['btn-vis', { active: visualizacao === opt.id }]"
          :disabled="carregando"
          @click="$emit('update:visualizacao', opt.id)"
        >
          <i :class="opt.icon"></i>
          {{ opt.label }}
        </button>
      </div>
    </div>

    <div class="filtro-grupo">
      <label>Natureza</label>
      <div class="tipo-list">
        <button
          v-for="tipo in tiposOrdenados"
          :key="tipo.value"
          type="button"
          :class="['btn-tipo', { active: naturezaSelecionada === tipo.value }]"
          :disabled="carregando"
          @click="$emit('update:natureza', naturezaSelecionada === tipo.value ? '' : tipo.value)"
        >
          <span class="tipo-cor" :style="{ background: tipo.cor }"></span>
          {{ tipo.label }}
          <span v-if="tipo.count" class="tipo-count">{{ tipo.count }}</span>
        </button>
      </div>
    </div>

    <div class="filtro-grupo">
      <label>Bairro</label>
      <select
        class="select-bairro"
        :value="bairroSelecionado"
        :disabled="carregando"
        @change="$emit('update:bairro', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Todos os bairros</option>
        <option v-for="bairro in bairros" :key="bairro" :value="bairro">
          {{ bairro }}
        </option>
      </select>
    </div>

    <div class="filtro-grupo">
      <label>Periodo</label>
      <div class="periodo-grid">
        <button
          v-for="opt in periodoOpts"
          :key="opt.value"
          type="button"
          :class="['btn-periodo', { active: periodoAtivo === opt.value }]"
          :disabled="carregando"
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
          :disabled="carregando"
          @input="$emit('update:dataInicio', ($event.target as HTMLInputElement).value)"
        />
        <input
          type="date"
          class="input-date"
          :value="dataFim"
          :disabled="carregando"
          @input="$emit('update:dataFim', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </div>

    <div class="filtro-secao">
      <h4 class="filtro-titulo">Precisao</h4>
      <div class="precisao-toggles">
        <button
          v-for="p in opcoesPrecisao"
          :key="p.valor"
          type="button"
          class="precisao-btn"
          :class="{
            active: precisaoAtiva(p.valor),
            [p.classe]: true,
          }"
          :disabled="carregando"
          @click="togglePrecisao(p.valor)"
        >
          <span class="precisao-dot" :style="{ background: p.cor }"></span>
          <span class="precisao-label">{{ p.label }}</span>
          <span class="precisao-count">{{ contagemPrecisao(p.valor) }}</span>
        </button>
      </div>
    </div>

    <div class="stats-mini">
      <div class="stat">
        <span class="stat-num"><AnimatedNumber :valor="total" :duracao="500" /></span>
        <span class="stat-label">ocorrencias</span>
      </div>
    </div>

    <EmptyState
      v-if="!carregando && total === 0"
      titulo="Nenhuma ocorrencia encontrada"
      descricao="Tente ajustar os filtros de periodo, natureza ou bairro para ver resultados."
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

    <button class="btn-limpar" type="button" :disabled="carregando" @click="$emit('limpar')">
      <i class="mdi mdi-filter-remove"></i>
      Limpar filtros
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import {
  CRIME_CORES,
  CRIME_LABELS,
  PRECISAO_COORDENADA_CORES,
  type CrimesGeoJson,
  type PrecisaoCoordenada,
  type VisualizacaoMapa,
} from '../types/crime'

interface Props {
  visualizacao: VisualizacaoMapa
  naturezaSelecionada: string
  bairroSelecionado: string
  bairros: string[]
  geojsonOriginal: CrimesGeoJson
  precisaoSelecionada: PrecisaoCoordenada[]
  total: number
  tiposCrime: Record<string, number>
  dataInicio: string
  dataFim: string
  carregando: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visualizacao': [value: VisualizacaoMapa]
  'update:natureza': [value: string]
  'update:bairro': [value: string]
  'update:dataInicio': [value: string]
  'update:dataFim': [value: string]
  'update:precisao': [value: PrecisaoCoordenada[]]
  limpar: []
}>()

const visualizacoes: Array<{
  id: VisualizacaoMapa
  label: string
  icon: string
}> = [
  {
    id: 'ocorrencias',
    label: 'Ocorrencias',
    icon: 'mdi mdi-map-marker-multiple',
  },
  { id: 'risco-bairros', label: 'Bairros', icon: 'mdi mdi-shield-alert' },
  { id: 'risco-ruas', label: 'Ruas', icon: 'mdi mdi-road-variant' },
]

const periodoOpts = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'all', label: 'Todos' },
]

const opcoesPrecisao: Array<{
  valor: PrecisaoCoordenada
  label: string
  cor: string
  classe: string
}> = [
  {
    valor: 'ALTA',
    label: 'Precisa',
    cor: PRECISAO_COORDENADA_CORES.ALTA,
    classe: 'btn-alta',
  },
  {
    valor: 'MEDIA',
    label: 'Aproximada',
    cor: PRECISAO_COORDENADA_CORES.MEDIA,
    classe: 'btn-media',
  },
  {
    valor: 'BAIXA',
    label: 'Imprecisa',
    cor: PRECISAO_COORDENADA_CORES.BAIXA,
    classe: 'btn-baixa',
  },
]

const tiposOrdenados = computed(() =>
  Object.entries(CRIME_LABELS).map(([value, label]) => ({
    value,
    label,
    cor: CRIME_CORES[value],
    count: props.tiposCrime[value] || 0,
  })),
)

const periodoAtivo = computed(() => {
  if (!props.dataInicio && !props.dataFim) return 'all'

  const hoje = new Date()
  const inicio = props.dataInicio ? new Date(props.dataInicio) : null
  const fim = props.dataFim ? new Date(props.dataFim) : null

  if (!inicio || !fim) return null

  const diffDays = Math.ceil(
    (hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays <= 7 && diffDays >= 6) return '7d'
  if (diffDays <= 30 && diffDays >= 29) return '30d'
  if (diffDays <= 90 && diffDays >= 89) return '90d'

  return null
})

const contagensPrecisao = computed<Record<PrecisaoCoordenada, number>>(() => {
  const contagem: Record<PrecisaoCoordenada, number> = {
    ALTA: 0,
    MEDIA: 0,
    BAIXA: 0,
  }

  props.geojsonOriginal.features.forEach((feature) => {
    contagem[feature.properties.precisaoCoordenada] += 1
  })

  return contagem
})

function selecionarPeriodo(periodo: string) {
  const hoje = new Date()
  const dataFimFormatada = hoje.toISOString().split('T')[0] || ''

  if (periodo === 'all') {
    emit('update:dataInicio', '')
    emit('update:dataFim', '')
    return
  }

  const dias = periodo === '7d' ? 7 : periodo === '30d' ? 30 : 90
  const dataInicio = new Date(hoje)
  dataInicio.setDate(dataInicio.getDate() - dias)
  const dataInicioFormatada = dataInicio.toISOString().split('T')[0] || ''

  emit('update:dataInicio', dataInicioFormatada)
  emit('update:dataFim', dataFimFormatada)
}

function precisaoAtiva(valor: PrecisaoCoordenada): boolean {
  return (
    props.precisaoSelecionada.length === 0 ||
    props.precisaoSelecionada.includes(valor)
  )
}

function togglePrecisao(valor: PrecisaoCoordenada) {
  const proximasPrecissoes =
    props.precisaoSelecionada.length === 0
      ? [valor]
      : props.precisaoSelecionada.includes(valor)
        ? props.precisaoSelecionada.filter((item) => item !== valor)
        : [...props.precisaoSelecionada, valor]

  const precissoesUnicas = Array.from(new Set(proximasPrecissoes))

  emit(
    'update:precisao',
    precissoesUnicas.length === opcoesPrecisao.length ? [] : precissoesUnicas,
  )
}

function contagemPrecisao(valor: PrecisaoCoordenada): number {
  return contagensPrecisao.value[valor]
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

.filtros-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.filtros-status {
  flex-shrink: 0;
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

.filtro-secao {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-titulo {
  margin: 0;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.precisao-toggles {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.precisao-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.precisao-btn:hover:not(:disabled) {
  border-color: #475569;
  color: #94a3b8;
}

.precisao-btn.active {
  color: #e2e8f0;
  background: #1e293b;
}

.precisao-btn:not(.active) {
  opacity: 0.4;
}

.precisao-btn.btn-alta.active {
  border-color: rgba(34, 197, 94, 0.45);
}

.precisao-btn.btn-media.active {
  border-color: rgba(245, 158, 11, 0.45);
}

.precisao-btn.btn-baixa.active {
  border-color: rgba(239, 68, 68, 0.45);
}

.precisao-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.precisao-label {
  flex: 1;
}

.precisao-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
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

.btn-limpar:hover:not(:disabled) {
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

button:disabled,
select:disabled,
input:disabled {
  opacity: 0.6;
  cursor: wait;
}
</style>
