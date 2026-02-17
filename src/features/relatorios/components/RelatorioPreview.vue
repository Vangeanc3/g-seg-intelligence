<template>
  <div class="preview-container">
    <!-- Header do relatório -->
    <div class="preview-header">
      <div class="preview-header-left">
        <div class="preview-logo">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
            <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
          </svg>
        </div>
        <div>
          <h2 class="preview-titulo">{{ config.titulo }}</h2>
          <p class="preview-subtitulo">G-SEG Intelligence — Belém/PA</p>
        </div>
      </div>
      <div class="preview-periodo">
        {{ formatDate(config.periodo.inicio) }} — {{ formatDate(config.periodo.fim) }}
      </div>
    </div>

    <!-- Cards resumo -->
    <div class="preview-cards">
      <div class="preview-card">
        <span class="pc-label">Total de Ocorrências</span>
        <span class="pc-valor">{{ resumo.totalCrimes }}</span>
      </div>
      <div class="preview-card">
        <span class="pc-label">Média Diária</span>
        <span class="pc-valor">{{ resumo.mediaDiaria }}</span>
      </div>
      <div class="preview-card">
        <span class="pc-label">Bairro Crítico</span>
        <span class="pc-valor small">{{ resumo.bairroMaisPerigoso }}</span>
      </div>
      <div class="preview-card">
        <span class="pc-label">Horário de Pico</span>
        <span class="pc-valor small">{{ resumo.horarioPico }}</span>
      </div>
    </div>

    <!-- Distribuição por tipo -->
    <div class="preview-section">
      <h3 class="section-titulo">Distribuição por Tipo de Crime</h3>
      <div class="tipo-bars">
        <div v-for="t in resumo.porTipo" :key="t.tipo" class="tipo-bar-row">
          <span class="tipo-bar-label">
            <span class="tipo-dot" :style="{ background: t.cor }"></span>
            {{ t.label }}
          </span>
          <div class="tipo-bar-track">
            <div class="tipo-bar-fill" :style="{ width: t.percentual + '%', background: t.cor }"></div>
          </div>
          <span class="tipo-bar-value">{{ t.total }} ({{ t.percentual }}%)</span>
        </div>
      </div>
    </div>

    <!-- Top bairros -->
    <div class="preview-section">
      <h3 class="section-titulo">Top 10 Bairros com Mais Ocorrências</h3>
      <table class="preview-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Bairro</th>
            <th>Ocorrências</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(b, i) in resumo.porBairro" :key="b.bairro">
            <td>{{ i + 1 }}</td>
            <td>{{ b.bairro }}</td>
            <td>{{ b.total }}</td>
            <td>{{ b.percentual }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Status -->
    <div class="preview-section">
      <h3 class="section-titulo">Status das Ocorrências</h3>
      <div class="status-row">
        <div v-for="s in resumo.porStatus" :key="s.status" class="status-item">
          <span class="status-dot" :style="{ background: s.cor }"></span>
          <span class="status-label">{{ s.label }}</span>
          <span class="status-count">{{ s.total }}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="preview-footer">
      <span>Gerado em {{ new Date().toLocaleDateString('pt-BR') }} às {{ new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }}</span>
      <span>G-SEG Intelligence © {{ new Date().getFullYear() }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RelatorioConfig, RelatorioResumo } from '../types/relatorio'

defineProps<{
  config: RelatorioConfig
  resumo: RelatorioResumo
}>()

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<style scoped>
.preview-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 2rem;
  max-width: 900px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.25rem;
  border-bottom: 2px solid #3b82f6;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 10px;
}

.preview-titulo {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.preview-subtitulo {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0.125rem 0 0;
}

.preview-periodo {
  font-size: 0.8125rem;
  color: #94a3b8;
  background: #0f172a;
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

.preview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.preview-card {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pc-label {
  font-size: 0.6875rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.pc-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.pc-valor.small {
  font-size: 1rem;
}

.preview-section {
  margin-bottom: 1.5rem;
}

.section-titulo {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #334155;
}

/* Tipo bars */
.tipo-bars {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.tipo-bar-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tipo-bar-label {
  width: 120px;
  font-size: 0.8125rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
}

.tipo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.tipo-bar-track {
  flex: 1;
  height: 8px;
  background: #0f172a;
  border-radius: 4px;
  overflow: hidden;
}

.tipo-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.tipo-bar-value {
  width: 90px;
  text-align: right;
  font-size: 0.75rem;
  color: #64748b;
  flex-shrink: 0;
}

/* Tabela */
.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #334155;
}

.preview-table td {
  padding: 0.5rem 0.75rem;
  font-size: 0.8125rem;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
}

/* Status */
.status-row {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-label {
  font-size: 0.8125rem;
  color: #94a3b8;
}

.status-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
}

/* Footer */
.preview-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 1.25rem;
  border-top: 1px solid #334155;
  margin-top: 1.5rem;
  font-size: 0.6875rem;
  color: #475569;
}

@media (max-width: 768px) {
  .preview-container {
    padding: 1.25rem;
  }

  .preview-header {
    flex-direction: column;
    text-align: center;
  }

  .preview-header-left {
    flex-direction: column;
  }

  .preview-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-footer {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .preview-cards {
    grid-template-columns: 1fr;
  }

  .tipo-bar-row {
    flex-wrap: wrap;
  }

  .tipo-bar-label {
    width: 100%;
  }

  .tipo-bar-value {
    width: auto;
  }
}
</style>
