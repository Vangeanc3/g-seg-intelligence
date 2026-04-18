<template>
  <div class="tabela-ruas-container">
    <h3 class="tabela-titulo">Top Ruas mais Perigosas</h3>

    <div v-if="ruas.length > 0" class="tabela-wrapper">
      <table class="ruas-table">
        <thead>
          <tr>
            <th class="th-pos">#</th>
            <th>Rua</th>
            <th>Tipo</th>
            <th class="th-num">Crimes</th>
            <th>Risco</th>
            <th>Crime Predominante</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rua, index) in ruas" :key="rua.ruaId" class="rua-row">
            <td class="td-pos">
              <span class="pos-badge" :class="posBadgeClass(index)">
                {{ index + 1 }}
              </span>
            </td>
            <td class="td-nome">{{ rua.nome }}</td>
            <td class="td-tipo">{{ tipoLabel(rua.tipo) }}</td>
            <td class="td-num">
              <div class="barra-wrapper">
                <div
                  class="barra"
                  :style="{
                    width: barraWidth(rua.totalCrimes),
                    background: riscoCor(rua.nivelRisco),
                  }"
                ></div>
                <span class="barra-valor">{{ rua.totalCrimes }}</span>
              </div>
            </td>
            <td>
              <span
                class="risco-tag"
                :style="{
                  color: riscoCor(rua.nivelRisco),
                  background: riscoCor(rua.nivelRisco) + '18',
                }"
              >
                {{ rua.nivelRisco }}
              </span>
            </td>
            <td class="td-natureza">
              <span
                v-if="rua.naturezaPredominante"
                class="natureza-tag"
                :style="{
                  color: naturezaCor(rua.naturezaPredominante),
                  background: naturezaCor(rua.naturezaPredominante) + '18',
                }"
              >
                {{ naturezaLabel(rua.naturezaPredominante) }}
              </span>
              <span v-else class="td-vazio">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState
      v-else
      titulo="Sem dados de ruas"
      descricao="Nao ha ruas com crimes registrados no periodo selecionado."
      icone="mdi mdi-road-variant"
      cor="#3b82f6"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { CRIME_CORES, CRIME_LABELS } from '@/features/mapa-crimes/types/crime'
import EmptyState from '@/shared/components/EmptyState.vue'
import type { RuaRankingItem } from '../services/analyticsService'

const props = defineProps<{
  ruas: RuaRankingItem[]
}>()

const maxCrimes = computed(() => props.ruas[0]?.totalCrimes || 1)

function barraWidth(total: number): string {
  return Math.round((total / maxCrimes.value) * 100) + '%'
}

function posBadgeClass(index: number): string {
  if (index === 0) return 'pos-1'
  if (index === 1) return 'pos-2'
  if (index === 2) return 'pos-3'
  return ''
}

function tipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    residential: 'Residencial',
    primary: 'Principal',
    secondary: 'Secundaria',
    tertiary: 'Terciaria',
    service: 'Servico',
    unclassified: 'Sem classificacao',
  }

  return labels[tipo] || tipo
}

function riscoCor(nivel: string): string {
  const cores: Record<string, string> = {
    Seguro: '#22c55e',
    Baixo: '#84cc16',
    Medio: '#f59e0b',
    Alto: '#f97316',
    Critico: '#ef4444',
  }

  return cores[nivel] || '#64748b'
}

function naturezaLabel(natureza: string): string {
  return CRIME_LABELS[natureza] || natureza
}

function naturezaCor(natureza: string): string {
  return CRIME_CORES[natureza] || '#64748b'
}
</script>

<style scoped>
.tabela-ruas-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
}

.tabela-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1rem;
}

.tabela-wrapper {
  overflow-x: auto;
}

.ruas-table {
  width: 100%;
  border-collapse: collapse;
}

.ruas-table th {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #334155;
}

.ruas-table td {
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.4);
}

.rua-row:hover {
  background: rgba(59, 130, 246, 0.05);
}

.rua-row:last-child td {
  border-bottom: none;
}

.th-pos {
  width: 40px;
  text-align: center;
}

.th-num {
  width: 120px;
}

.td-pos {
  text-align: center;
}

.td-nome {
  font-weight: 500;
}

.td-tipo {
  color: #94a3b8;
  font-size: 0.75rem;
}

.td-vazio {
  color: #475569;
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
  color: #94a3b8;
  background: #0f172a;
}

.pos-1 {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.pos-2 {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.pos-3 {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.barra-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.barra {
  height: 6px;
  border-radius: 3px;
  min-width: 4px;
  transition: width 0.5s ease;
}

.barra-valor {
  font-size: 0.8125rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  min-width: 24px;
}

.risco-tag,
.natureza-tag {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 500;
}

.td-natureza {
  font-size: 0.75rem;
}

@media (max-width: 768px) {
  .td-tipo,
  .td-natureza,
  .ruas-table th:nth-child(3),
  .ruas-table th:nth-child(6) {
    display: none;
  }
}
</style>
