<template>
  <div class="tabela-container">
    <h3 class="tabela-titulo">{{ titulo }}</h3>
    <EmptyState
      v-if="dados.length === 0"
      titulo="Sem dados de categorias"
      descricao="Nao ha ocorrencias suficientes para gerar o ranking de categorias."
      icone="mdi mdi-format-list-numbered"
      cor="#3b82f6"
    />
    <div v-else class="tabela-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th class="th-pos">#</th>
            <th class="th-label">Categoria</th>
            <th class="th-total">Ocorrencias</th>
            <th class="th-percent">%</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in ranking" :key="item.label">
            <td class="td-pos">
              <span class="pos-badge" :class="'pos-' + (index + 1)">{{ index + 1 }}</span>
            </td>
            <td class="td-label">{{ item.label }}</td>
            <td class="td-total">{{ item.total }}</td>
            <td class="td-percent">
              <div class="percent-bar-wrapper">
                <div class="percent-bar" :style="{ width: item.percentual + '%' }"></div>
                <span class="percent-text">{{ item.percentual }}%</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import type { LabelTotal } from '../services/analyticsService'

const props = withDefaults(
  defineProps<{
    dados: LabelTotal[]
    titulo?: string
  }>(),
  {
    titulo: 'Top Categorias de Crimes',
  },
)

const ranking = computed(() => {
  const total = props.dados.reduce((acc, item) => acc + item.total, 0) || 1

  return props.dados.map((item) => ({
    ...item,
    percentual: Math.round((item.total / total) * 100),
  }))
})
</script>

<style scoped>
.tabela-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.25rem;
}

.tabela-titulo {
  color: #e2e8f0;
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.tabela-wrapper {
  overflow-x: auto;
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th {
  text-align: left;
  padding: 0.625rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #334155;
}

.ranking-table td {
  padding: 0.75rem;
  font-size: 0.8125rem;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
}

.ranking-table tr:last-child td {
  border-bottom: none;
}

.ranking-table tr:hover td {
  background: rgba(59, 130, 246, 0.05);
}

.pos-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: #334155;
  color: #94a3b8;
}

.pos-1 { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.pos-2 { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
.pos-3 { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }

.td-label {
  font-weight: 500;
}

.td-total {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.percent-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.percent-bar {
  height: 6px;
  background: #3b82f6;
  border-radius: 3px;
  min-width: 4px;
  max-width: 120px;
  transition: width 0.3s ease;
}

.percent-text {
  font-size: 0.75rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.th-pos { width: 40px; }
.th-total { width: 120px; }
.th-percent { width: 180px; }
</style>
