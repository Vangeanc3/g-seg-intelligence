<template>
  <div class="config-container">
    <h2 class="config-titulo">Configurar Relatório</h2>
    <p class="config-descricao">Defina os parâmetros para gerar seu relatório de segurança.</p>

    <div class="config-form">
      <!-- Título -->
      <div class="form-grupo">
        <label class="form-label">Título do Relatório</label>
        <input
          type="text"
          class="form-input"
          v-model="props.config.titulo"
          placeholder="Ex: Relatório Mensal de Segurança"
        />
      </div>

      <!-- Período -->
      <div class="form-grupo">
        <label class="form-label">Período</label>
        <div class="date-row">
          <input type="date" class="form-input date" v-model="props.config.periodo.inicio" />
          <span class="date-sep">até</span>
          <input type="date" class="form-input date" v-model="props.config.periodo.fim" />
        </div>
        <div class="periodo-rapido">
          <button
            v-for="opt in periodoOpts"
            :key="opt.dias"
            class="btn-periodo"
            @click="setPeriodo(opt.dias)"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Bairros -->
      <div class="form-grupo">
        <label class="form-label">Bairros <span class="form-hint">(vazio = todos)</span></label>
        <div class="checkbox-grid">
          <label
            v-for="bairro in bairrosDisponiveis"
            :key="bairro"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="bairro"
              v-model="props.config.bairros"
            />
            <span>{{ bairro }}</span>
          </label>
        </div>
      </div>

      <!-- Tipos de crime -->
      <div class="form-grupo">
        <label class="form-label">Tipos de Crime <span class="form-hint">(vazio = todos)</span></label>
        <div class="checkbox-grid tipos">
          <label
            v-for="tipo in tiposDisponiveis"
            :key="tipo.value"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="tipo.value"
              v-model="props.config.tipos"
            />
            <span class="tipo-label">
              <span class="tipo-dot" :style="{ background: tipo.cor }"></span>
              {{ tipo.label }}
            </span>
          </label>
        </div>
      </div>

      <!-- Info preview -->
      <div v-if="totalFiltrado > 0" class="config-preview-info">
        <i class="mdi mdi-information-outline"></i>
        <span>{{ totalFiltrado }} ocorrências encontradas com os filtros atuais</span>
      </div>
      <div v-else class="config-empty-warning">
        <i class="mdi mdi-alert-circle"></i>
        <span>Nenhuma ocorrência encontrada. Ajuste os filtros para gerar o relatório.</span>
      </div>

      <!-- Botão gerar -->
      <button class="btn-gerar" @click="$emit('gerar')" :disabled="totalFiltrado === 0">
        <i class="mdi mdi-file-chart"></i>
        Gerar Relatório
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RelatorioConfig } from '../types/relatorio'
import { CRIME_LABELS, CRIME_CORES } from '@/features/mapa-crimes/types/crime'

const props = defineProps<{
  config: RelatorioConfig
  bairrosDisponiveis: string[]
  totalFiltrado: number
}>()

defineEmits<{ gerar: [] }>()

const tiposDisponiveis = Object.entries(CRIME_LABELS).map(([value, label]) => ({
  value,
  label,
  cor: CRIME_CORES[value as keyof typeof CRIME_CORES],
}))

const periodoOpts = [
  { label: '7 dias', dias: 7 },
  { label: '30 dias', dias: 30 },
  { label: '90 dias', dias: 90 },
]

function setPeriodo(dias: number) {
  const fim = new Date()
  const inicio = new Date()
  inicio.setDate(inicio.getDate() - dias)
  props.config.periodo.inicio = inicio.toISOString().split('T')[0]!
  props.config.periodo.fim = fim.toISOString().split('T')[0]!
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

.checkbox-item input[type="checkbox"] {
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
