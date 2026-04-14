<template>
  <div class="config-container">
    <h2 class="config-titulo">Configurar Relatorio</h2>
    <p class="config-descricao">Defina os parametros para gerar seu relatorio de seguranca.</p>

    <div class="config-form">
      <div class="form-grupo">
        <label class="form-label">Titulo do Relatorio</label>
        <input
          type="text"
          class="form-input"
          :value="props.config.titulo"
          placeholder="Ex: Relatorio Mensal de Seguranca"
          @input="atualizarCampo('titulo', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="form-grupo">
        <label class="form-label">Periodo</label>
        <div class="date-row">
          <input
            type="date"
            class="form-input date"
            :value="props.config.dataInicio"
            @input="atualizarCampo('dataInicio', ($event.target as HTMLInputElement).value)"
          />
          <span class="date-sep">ate</span>
          <input
            type="date"
            class="form-input date"
            :value="props.config.dataFim"
            @input="atualizarCampo('dataFim', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="periodo-rapido">
          <button
            v-for="opt in periodoOpts"
            :key="opt.dias"
            type="button"
            class="btn-periodo"
            @click="setPeriodo(opt.dias)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="form-grupo">
        <label class="form-label">Bairros <span class="form-hint">(vazio = todos)</span></label>
        <div class="checkbox-grid">
          <label
            v-for="bairro in props.bairrosDisponiveis"
            :key="bairro"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :checked="props.config.bairros.includes(bairro)"
              @change="alternarSelecao('bairros', bairro, ($event.target as HTMLInputElement).checked)"
            />
            <span>{{ bairro }}</span>
          </label>
        </div>
      </div>

      <div class="form-grupo">
        <label class="form-label">Tipos de Crime <span class="form-hint">(vazio = todos)</span></label>
        <div class="checkbox-grid tipos">
          <label
            v-for="nat in naturezasDisponiveis"
            :key="nat.value"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :checked="props.config.naturezas.includes(nat.value)"
              @change="alternarSelecao('naturezas', nat.value, ($event.target as HTMLInputElement).checked)"
            />
            <span class="tipo-label">
              <span class="tipo-dot" :style="{ background: nat.cor }"></span>
              {{ nat.label }}
            </span>
          </label>
        </div>
      </div>

      <div v-if="props.carregando" class="config-preview-info loading">
        <i class="mdi mdi-loading mdi-spin"></i>
        <span>Buscando ocorrencias...</span>
      </div>
      <div v-else-if="props.totalFiltrado > 0" class="config-preview-info">
        <i class="mdi mdi-information-outline"></i>
        <span>{{ props.totalFiltrado }} ocorrencias encontradas com os filtros atuais</span>
      </div>
      <div v-else class="config-empty-warning">
        <i class="mdi mdi-alert-circle"></i>
        <span>Nenhuma ocorrencia encontrada. Ajuste os filtros para gerar o relatorio.</span>
      </div>

      <button
        type="button"
        class="btn-gerar"
        :disabled="props.totalFiltrado === 0 || props.carregando"
        @click="emit('gerar')"
      >
        <i class="mdi mdi-file-chart"></i>
        {{ props.carregando ? 'Buscando...' : 'Gerar Relatorio' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CRIME_CORES, CRIME_LABELS } from '@/features/mapa-crimes/types/crime'
import type { RelatorioConfig } from '../types/relatorio'

const props = defineProps<{
  config: RelatorioConfig
  bairrosDisponiveis: string[]
  totalFiltrado: number
  carregando: boolean
}>()

const emit = defineEmits<{
  gerar: []
  'update:config': [value: RelatorioConfig]
}>()

const naturezasDisponiveis = Object.entries(CRIME_LABELS).map(([value, label]) => ({
  value,
  label,
  cor: CRIME_CORES[value] ?? '#6b7280',
}))

const periodoOpts = [
  { label: '7 dias', dias: 7 },
  { label: '30 dias', dias: 30 },
  { label: '90 dias', dias: 90 },
]

function emitConfig(parcial: Partial<RelatorioConfig>) {
  emit('update:config', {
    ...props.config,
    ...parcial,
  })
}

function atualizarCampo<K extends keyof RelatorioConfig>(
  campo: K,
  valor: RelatorioConfig[K],
) {
  emitConfig({ [campo]: valor } as Pick<RelatorioConfig, K>)
}

function alternarSelecao(
  campo: 'bairros' | 'naturezas',
  valor: string,
  checked: boolean,
) {
  const atual = props.config[campo]
  const proximo = checked
    ? [...atual, valor]
    : atual.filter((item) => item !== valor)

  emitConfig({ [campo]: proximo } as Pick<RelatorioConfig, typeof campo>)
}

function setPeriodo(dias: number) {
  const fim = new Date()
  const inicio = new Date()
  inicio.setDate(inicio.getDate() - dias)

  emitConfig({
    dataInicio: inicio.toISOString().split('T')[0]!,
    dataFim: fim.toISOString().split('T')[0]!,
  })
}
</script>

<style scoped>
.config-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
}

.config-titulo {
  color: #e2e8f0;
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.config-descricao {
  color: #64748b;
  font-size: 0.8125rem;
  margin: 0.25rem 0 1.5rem;
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-grupo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #94a3b8;
}

.form-hint {
  font-weight: 400;
  color: #475569;
}

.form-input {
  padding: 0.5rem 0.75rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input::-webkit-calendar-picker-indicator {
  filter: invert(0.7);
}

.date-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.date-row .date {
  flex: 1;
}

.date-sep {
  color: #64748b;
  font-size: 0.8125rem;
}

.periodo-rapido {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.btn-periodo {
  padding: 0.3rem 0.75rem;
  border: 1px solid #334155;
  background: transparent;
  color: #94a3b8;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-periodo:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.5rem;
}

.checkbox-grid.tipos {
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #94a3b8;
  font-size: 0.8125rem;
  cursor: pointer;
}

.checkbox-item input[type='checkbox'] {
  accent-color: #3b82f6;
}

.tipo-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.tipo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.config-preview-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  color: #60a5fa;
  font-size: 0.8125rem;
}

.btn-gerar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-gerar:hover:not(:disabled) {
  background: #2563eb;
}

.btn-gerar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.config-preview-info.loading {
  background: rgba(148, 163, 184, 0.1);
  border-color: rgba(148, 163, 184, 0.2);
  color: #94a3b8;
}

.config-empty-warning {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  color: #f59e0b;
  font-size: 0.8125rem;
}

@media (max-width: 480px) {
  .checkbox-grid {
    grid-template-columns: 1fr;
  }

  .checkbox-grid.tipos {
    grid-template-columns: 1fr;
  }

  .periodo-rapido {
    flex-wrap: wrap;
  }

  .date-row {
    flex-direction: column;
  }

  .date-sep {
    display: none;
  }
}
</style>
