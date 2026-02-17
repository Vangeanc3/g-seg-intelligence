<template>
  <div class="tabela-container">
    <h3 class="tabela-titulo">Ranking de Bairros</h3>
    <EmptyState
      v-if="ranking.length === 0"
      titulo="Sem dados de ranking"
      descricao="Não há ocorrências suficientes para gerar o ranking de bairros."
      icone="mdi mdi-format-list-numbered"
      cor="#3b82f6"
    />
    <div v-else class="tabela-wrapper">
      <table class="ranking-table">
        <thead>
          <tr>
            <th class="th-pos">#</th>
            <th class="th-bairro">Bairro</th>
            <th class="th-total">Ocorrências</th>
            <th class="th-percent">%</th>
            <th class="th-tipo">Tipo Predominante</th>
            <th v-if="temVariacao" class="th-variacao">Variação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in ranking" :key="item.bairro">
            <td class="td-pos">
              <span class="pos-badge" :class="'pos-' + (index + 1)">{{ index + 1 }}</span>
            </td>
            <td class="td-bairro">{{ item.bairro }}</td>
            <td class="td-total">{{ item.total }}</td>
            <td class="td-percent">
              <div class="percent-bar-wrapper">
                <div class="percent-bar" :style="{ width: item.percentual + '%' }"></div>
                <span class="percent-text">{{ item.percentual }}%</span>
              </div>
            </td>
            <td class="td-tipo">
              <span class="tipo-tag" :style="{ color: corTipo(item.tipoPredominante), background: corTipo(item.tipoPredominante) + '20' }">
                {{ labelTipo(item.tipoPredominante) }}
              </span>
            </td>
            <td v-if="temVariacao" class="td-variacao">
              <span
                v-if="item.variacao !== null"
                class="variacao-badge"
                :class="item.variacao >= 0 ? 'up' : 'down'"
              >
                <i :class="item.variacao >= 0 ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'"></i>
                {{ Math.abs(item.variacao) }}%
              </span>
              <span v-else class="variacao-na">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CRIME_LABELS, CRIME_CORES } from '@/features/mapa-crimes/types/crime'
import EmptyState from '@/shared/components/EmptyState.vue'

interface RankingItem {
  bairro: string
  total: number
  percentual: number
  variacao: number | null
  tipoPredominante: string
}

const props = defineProps<{
  ranking: RankingItem[]
}>()

const temVariacao = computed(() => props.ranking.some(r => r.variacao !== null))

function labelTipo(tipo: string): string {
  return CRIME_LABELS[tipo as keyof typeof CRIME_LABELS] || tipo
}

function corTipo(tipo: string): string {
  return CRIME_CORES[tipo as keyof typeof CRIME_CORES] || '#6b7280'
}
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

.td-bairro {
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
  max-width: 100px;
  transition: width 0.3s ease;
}

.percent-text {
  font-size: 0.75rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.tipo-tag {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.variacao-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.variacao-badge.up {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.variacao-badge.down {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.variacao-na {
  color: #475569;
}

.th-pos { width: 40px; }
.th-total { width: 100px; }
.th-percent { width: 160px; }
.th-variacao { width: 90px; }
</style>
