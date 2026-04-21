<template>
  <div class="comparativo-page">
    <div class="page-header">
      <h1>Comparativo entre Bairros</h1>
      <p>Selecione dois bairros para comparar estatísticas criminais lado a lado.</p>
    </div>

    <div class="seletores">
      <div class="seletor">
        <label class="seletor-label">Bairro A</label>
        <select
          class="seletor-select"
          :value="bairroA.nome"
          :disabled="carregandoBairros"
          @change="onSelecionarBairroA"
        >
          <option value="">
            {{ carregandoBairros ? 'Carregando bairros...' : 'Selecionar bairro...' }}
          </option>
          <option
            v-for="bairro in bairrosDisponiveis"
            :key="bairro"
            :value="bairro"
            :disabled="bairro === bairroB.nome"
          >
            {{ bairro }}
          </option>
        </select>
      </div>

      <div class="vs-badge">VS</div>

      <div class="seletor">
        <label class="seletor-label">Bairro B</label>
        <select
          class="seletor-select"
          :value="bairroB.nome"
          :disabled="carregandoBairros"
          @change="onSelecionarBairroB"
        >
          <option value="">
            {{ carregandoBairros ? 'Carregando bairros...' : 'Selecionar bairro...' }}
          </option>
          <option
            v-for="bairro in bairrosDisponiveis"
            :key="bairro"
            :value="bairro"
            :disabled="bairro === bairroA.nome"
          >
            {{ bairro }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="bairroA.carregando || bairroB.carregando" class="loading-state">
      <div class="loading-cards">
        <SkeletonLoader tipo="card" />
        <SkeletonLoader tipo="card" />
      </div>
      <SkeletonLoader tipo="grafico" />
      <SkeletonLoader tipo="grafico" />
    </div>

    <EmptyState
      v-else-if="bairroA.erro || bairroB.erro"
      titulo="Erro ao carregar dados"
      descricao="Verifique se o servidor está rodando e tente novamente."
      icone="mdi mdi-alert-circle"
      cor="#ef4444"
    />

    <template v-else-if="bairroA.dados && bairroB.dados">
      <div class="total-comparacao">
        <div
          class="total-card"
          :class="{ vencedor: comparativo && comparativo.totalA > comparativo.totalB }"
        >
          <span class="total-label">{{ bairroA.nome }}</span>
          <span class="total-valor">
            <AnimatedNumber :valor="bairroA.dados.totalCrimes" />
          </span>
          <span class="total-sub">ocorrências</span>
          <span
            v-if="riscoBairroA"
            class="risco-badge"
            :style="{ color: corRisco(riscoBairroA), borderColor: corRisco(riscoBairroA) }"
          >
            {{ labelRisco(riscoBairroA) }}
          </span>
        </div>

        <div class="total-diff" v-if="comparativo">
          <span
            class="diff-valor"
            :class="{
              mais: comparativo.diferencaTotal > 0,
              menos: comparativo.diferencaTotal < 0,
            }"
          >
            {{ comparativo.diferencaTotal > 0 ? '+' : '' }}{{ comparativo.diferencaPct }}%
          </span>
          <span class="diff-label">diferença</span>
          <span class="diff-total">
            {{ comparativo.diferencaTotal > 0 ? '+' : '' }}{{ comparativo.diferencaTotal }}
          </span>
        </div>

        <div
          class="total-card"
          :class="{ vencedor: comparativo && comparativo.totalB > comparativo.totalA }"
        >
          <span class="total-label">{{ bairroB.nome }}</span>
          <span class="total-valor">
            <AnimatedNumber :valor="bairroB.dados.totalCrimes" />
          </span>
          <span class="total-sub">ocorrências</span>
          <span
            v-if="riscoBairroB"
            class="risco-badge"
            :style="{ color: corRisco(riscoBairroB), borderColor: corRisco(riscoBairroB) }"
          >
            {{ labelRisco(riscoBairroB) }}
          </span>
        </div>
      </div>

      <section class="secao">
        <h3 class="secao-titulo">Distribuição por Natureza</h3>
        <div class="natureza-grid">
          <div v-for="natureza in naturezasComparadas" :key="natureza.chave" class="natureza-row">
            <div class="nat-barra-a">
              <div
                class="nat-fill"
                :style="{ width: natureza.pctA + '%', background: natureza.cor }"
              ></div>
              <span class="nat-valor">{{ natureza.totalA }}</span>
            </div>
            <span class="nat-label">{{ natureza.label }}</span>
            <div class="nat-barra-b">
              <div
                class="nat-fill right"
                :style="{ width: natureza.pctB + '%', background: natureza.cor }"
              ></div>
              <span class="nat-valor">{{ natureza.totalB }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="secao">
        <h3 class="secao-titulo">Tendência Mensal</h3>
        <div class="dia-grid">
          <div v-for="mes in mesesComparados" :key="mes.label" class="dia-row">
            <span class="dia-valor-a">{{ mes.totalA }}</span>
            <div class="dia-barra-a">
              <div class="dia-fill bairro-a" :style="{ width: mes.pctA + '%' }"></div>
            </div>
            <span class="dia-label mes-label">{{ mes.label }}</span>
            <div class="dia-barra-b">
              <div class="dia-fill bairro-b" :style="{ width: mes.pctB + '%' }"></div>
            </div>
            <span class="dia-valor-b">{{ mes.totalB }}</span>
          </div>
        </div>
        <div class="legenda-dias">
          <span class="legenda-item"><span class="dot bairro-a"></span>{{ bairroA.nome }}</span>
          <span class="legenda-item"><span class="dot bairro-b"></span>{{ bairroB.nome }}</span>
        </div>
      </section>

      <section class="secao">
        <h3 class="secao-titulo">Crimes por Dia da Semana</h3>
        <div class="dia-grid">
          <div v-for="dia in diasComparados" :key="dia.label" class="dia-row">
            <span class="dia-valor-a">{{ dia.totalA }}</span>
            <div class="dia-barra-a">
              <div class="dia-fill bairro-a" :style="{ width: dia.pctA + '%' }"></div>
            </div>
            <span class="dia-label">{{ dia.label }}</span>
            <div class="dia-barra-b">
              <div class="dia-fill bairro-b" :style="{ width: dia.pctB + '%' }"></div>
            </div>
            <span class="dia-valor-b">{{ dia.totalB }}</span>
          </div>
        </div>
      </section>

      <section class="secao">
        <h3 class="secao-titulo">Crimes por Faixa Horária</h3>
        <div class="dia-grid">
          <div v-for="faixa in faixasComparadas" :key="faixa.label" class="dia-row">
            <span class="dia-valor-a">{{ faixa.totalA }}</span>
            <div class="dia-barra-a">
              <div class="dia-fill bairro-a" :style="{ width: faixa.pctA + '%' }"></div>
            </div>
            <span class="dia-label">{{ faixa.label }}</span>
            <div class="dia-barra-b">
              <div class="dia-fill bairro-b" :style="{ width: faixa.pctB + '%' }"></div>
            </div>
            <span class="dia-valor-b">{{ faixa.totalB }}</span>
          </div>
        </div>
      </section>

      <section class="secao">
        <h3 class="secao-titulo">Qualidade dos Dados</h3>
        <div class="precisao-comparacao">
          <div class="precisao-lado">
            <span class="precisao-nome">{{ bairroA.nome }}</span>
            <span class="precisao-pct">
              {{ Math.round(bairroA.dados.precisao.percentualPreciso) }}% precisos
            </span>
          </div>
          <div class="precisao-lado">
            <span class="precisao-nome">{{ bairroB.nome }}</span>
            <span class="precisao-pct">
              {{ Math.round(bairroB.dados.precisao.percentualPreciso) }}% precisos
            </span>
          </div>
        </div>
      </section>
    </template>

    <EmptyState
      v-else
      titulo="Selecione dois bairros"
      descricao="Escolha um bairro em cada lado para ver a comparação."
      icone="mdi mdi-compare-horizontal"
      cor="#3b82f6"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import SkeletonLoader from '@/shared/components/SkeletonLoader.vue'
import EmptyState from '@/shared/components/EmptyState.vue'
import type { LabelTotal } from '@/features/analytics/services/analyticsService'
import { CRIME_CORES, CRIME_LABELS } from '@/features/mapa-crimes/types/crime'
import {
  RISCO_CORES,
  RISCO_LABELS,
  type NivelRisco,
} from '@/features/mapa-crimes/services/riscoService'
import { useComparativo } from './composables/useComparativo'

interface LinhaComparada {
  label: string
  totalA: number
  totalB: number
  pctA: number
  pctB: number
}

const {
  bairroA,
  bairroB,
  bairrosDisponiveis,
  carregandoBairros,
  selecionarBairroA,
  selecionarBairroB,
  comparativo,
  riscoBairroA,
  riscoBairroB,
} = useComparativo()

function onSelecionarBairroA(event: Event) {
  selecionarBairroA((event.target as HTMLSelectElement).value)
}

function onSelecionarBairroB(event: Event) {
  selecionarBairroB((event.target as HTMLSelectElement).value)
}

function totalPorLabel(dados: LabelTotal[], label: string): number {
  return dados.find((item) => item.label === label)?.total ?? 0
}

function criarLinhasComparadas(
  dadosA: LabelTotal[],
  dadosB: LabelTotal[],
  labels: string[],
): LinhaComparada[] {
  const maxTotal = Math.max(
    ...dadosA.map((item) => item.total),
    ...dadosB.map((item) => item.total),
    1,
  )

  return labels.map((label) => {
    const totalA = totalPorLabel(dadosA, label)
    const totalB = totalPorLabel(dadosB, label)

    return {
      label,
      totalA,
      totalB,
      pctA: Math.round((totalA / maxTotal) * 100),
      pctB: Math.round((totalB / maxTotal) * 100),
    }
  })
}

function formatarMes(label: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(label)
  if (!match) return label

  const data = new Date(Number(match[1]), Number(match[2]) - 1, 1)

  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: '2-digit',
  }).format(data)
}

function labelRisco(nivel: NivelRisco): string {
  return RISCO_LABELS[nivel]
}

function corRisco(nivel: NivelRisco): string {
  return RISCO_CORES[nivel]
}

const naturezasComparadas = computed(() => {
  const dadosA = bairroA.value.dados
  const dadosB = bairroB.value.dados
  if (!dadosA || !dadosB) return []

  const labels = Array.from(
    new Set([
      ...dadosA.porNatureza.map((item) => item.label),
      ...dadosB.porNatureza.map((item) => item.label),
    ]),
  )
  const maxTotal = Math.max(
    ...dadosA.porNatureza.map((item) => item.total),
    ...dadosB.porNatureza.map((item) => item.total),
    1,
  )

  return labels
    .map((chave) => {
      const totalA = totalPorLabel(dadosA.porNatureza, chave)
      const totalB = totalPorLabel(dadosB.porNatureza, chave)

      return {
        chave,
        label: CRIME_LABELS[chave] || chave,
        totalA,
        totalB,
        pctA: Math.round((totalA / maxTotal) * 100),
        pctB: Math.round((totalB / maxTotal) * 100),
        cor: CRIME_CORES[chave] || '#64748b',
      }
    })
    .sort((a, b) => b.totalA + b.totalB - (a.totalA + a.totalB))
})

const mesesComparados = computed(() => {
  const dadosA = bairroA.value.dados
  const dadosB = bairroB.value.dados
  if (!dadosA || !dadosB) return []

  const labels = Array.from(
    new Set([
      ...dadosA.porMes.map((item) => item.label),
      ...dadosB.porMes.map((item) => item.label),
    ]),
  ).sort((a, b) => a.localeCompare(b))

  return criarLinhasComparadas(dadosA.porMes, dadosB.porMes, labels).map((item) => ({
    ...item,
    label: formatarMes(item.label),
  }))
})

const diasComparados = computed(() => {
  const dadosA = bairroA.value.dados
  const dadosB = bairroB.value.dados
  if (!dadosA || !dadosB) return []

  const diasOrdem = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']
  return criarLinhasComparadas(dadosA.porDiaSemana, dadosB.porDiaSemana, diasOrdem)
})

const faixasComparadas = computed(() => {
  const dadosA = bairroA.value.dados
  const dadosB = bairroB.value.dados
  if (!dadosA || !dadosB) return []

  const ordemFaixas = ['00-06', '06-12', '12-18', '18-24']
  const labels = Array.from(
    new Set([
      ...ordemFaixas,
      ...dadosA.porFaixaHoraria.map((item) => item.label),
      ...dadosB.porFaixaHoraria.map((item) => item.label),
    ]),
  )

  return criarLinhasComparadas(dadosA.porFaixaHoraria, dadosB.porFaixaHoraria, labels)
})
</script>

<style scoped>
.comparativo-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.page-header p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.seletores {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.seletor {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.seletor-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.seletor-select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.875rem;
  cursor: pointer;
  outline: none;
}

.seletor-select:disabled {
  cursor: wait;
  opacity: 0.7;
}

.seletor-select:focus {
  border-color: #3b82f6;
}

.seletor-select option {
  background: #1e293b;
  color: #e2e8f0;
}

.vs-badge {
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1.25rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.loading-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.total-comparacao {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.total-card {
  flex: 1;
  min-width: 0;
  text-align: center;
  padding: 1.5rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.total-card.vencedor {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.2);
}

.total-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  overflow-wrap: anywhere;
}

.total-valor {
  font-size: 2.5rem;
  line-height: 1;
  font-weight: 800;
  color: #e2e8f0;
}

.total-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.risco-badge {
  align-self: center;
  margin-top: 0.5rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
}

.total-diff {
  min-width: 78px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.diff-valor {
  font-size: 1.25rem;
  font-weight: 700;
  color: #94a3b8;
}

.diff-valor.mais {
  color: #ef4444;
}

.diff-valor.menos {
  color: #22c55e;
}

.diff-label,
.diff-total {
  font-size: 0.625rem;
  color: #64748b;
  text-transform: uppercase;
}

.secao {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
}

.secao-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 1rem;
}

.natureza-grid,
.dia-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.natureza-row,
.dia-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nat-label {
  width: 140px;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  flex-shrink: 0;
  overflow-wrap: anywhere;
}

.nat-barra-a,
.nat-barra-b {
  flex: 1;
  min-width: 0;
  height: 22px;
  background: #0f172a;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.nat-barra-a {
  justify-content: flex-end;
}

.nat-fill {
  height: 100%;
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.5s ease;
}

.nat-barra-a .nat-fill {
  margin-left: auto;
}

.nat-valor {
  position: absolute;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #e2e8f0;
  padding: 0 0.375rem;
  font-variant-numeric: tabular-nums;
}

.nat-barra-a .nat-valor {
  right: 4px;
}

.nat-barra-b .nat-valor {
  left: 4px;
}

.dia-label {
  width: 68px;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  flex-shrink: 0;
}

.mes-label {
  width: 78px;
}

.dia-barra-a,
.dia-barra-b {
  flex: 1;
  min-width: 0;
  height: 16px;
  background: #0f172a;
  border-radius: 4px;
  overflow: hidden;
}

.dia-barra-a {
  display: flex;
  justify-content: flex-end;
}

.dia-barra-a .dia-fill {
  margin-left: auto;
}

.dia-fill {
  height: 100%;
  border-radius: 4px;
  min-width: 2px;
  transition: width 0.5s ease;
}

.bairro-a {
  background: #3b82f6;
}

.bairro-b {
  background: #f59e0b;
}

.dia-valor-a,
.dia-valor-b {
  width: 34px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  font-variant-numeric: tabular-nums;
}

.dia-valor-a {
  text-align: right;
}

.dia-valor-b {
  text-align: left;
}

.legenda-dias {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.precisao-comparacao {
  display: flex;
  gap: 1rem;
}

.precisao-lado {
  flex: 1;
  min-width: 0;
  padding: 1rem;
  background: #0f172a;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.precisao-nome {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.precisao-pct {
  font-size: 1.25rem;
  font-weight: 700;
  color: #22c55e;
}

@media (max-width: 768px) {
  .comparativo-page {
    gap: 1rem;
  }

  .seletores,
  .total-comparacao,
  .precisao-comparacao {
    flex-direction: column;
    align-items: stretch;
  }

  .vs-badge {
    align-self: center;
    margin-top: 0;
  }

  .loading-cards {
    grid-template-columns: 1fr;
  }

  .total-diff {
    align-self: center;
  }

  .secao,
  .total-card {
    padding: 1rem;
  }

  .natureza-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.375rem;
  }

  .nat-label {
    width: auto;
    order: -1;
  }

  .nat-barra-a {
    justify-content: flex-start;
  }

  .nat-barra-a .nat-fill {
    margin-left: 0;
  }

  .nat-barra-a .nat-valor {
    right: auto;
    left: 4px;
  }

  .dia-row {
    grid-template-columns: 32px minmax(0, 1fr) 68px minmax(0, 1fr) 32px;
    display: grid;
    gap: 0.375rem;
  }

  .dia-label,
  .mes-label {
    width: auto;
  }
}

@media (max-width: 480px) {
  .dia-row {
    grid-template-columns: 28px minmax(0, 1fr) 58px minmax(0, 1fr) 28px;
  }

  .dia-label,
  .dia-valor-a,
  .dia-valor-b {
    font-size: 0.6875rem;
  }
}
</style>
