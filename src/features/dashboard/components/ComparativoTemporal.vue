<template>
  <div class="comparativo-container">
    <div class="comparativo-header">
      <h3 class="comparativo-titulo">Comparativo Temporal</h3>
      <div class="modo-btns">
        <button
          class="modo-btn"
          :class="{ active: modo === 'mes' }"
          @click="modo = 'mes'"
        >
          Mensal
        </button>
        <button
          class="modo-btn"
          :class="{ active: modo === 'ano' }"
          @click="modo = 'ano'"
        >
          Anual
        </button>
      </div>
    </div>

    <!-- Labels de período -->
    <div class="periodo-labels">
      <span class="periodo-atual">
        <i class="mdi mdi-circle" style="color: #3b82f6; font-size: 0.5rem;"></i>
        {{ labelAtual }}
      </span>
      <span class="periodo-anterior">
        <i class="mdi mdi-circle" style="color: #475569; font-size: 0.5rem;"></i>
        {{ labelAnterior }}
      </span>
    </div>

    <!-- Cards de comparação -->
    <div class="comparativo-grid">
      <div v-for="item in metricas" :key="item.label" class="comp-card">
        <span class="comp-label">{{ item.label }}</span>
        <div class="comp-valores">
          <span class="comp-atual">{{ item.atual }}</span>
          <span
            class="comp-variacao"
            :class="item.variacao >= 0 ? 'up' : 'down'"
          >
            <i :class="item.variacao >= 0 ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'"></i>
            {{ Math.abs(item.variacao) }}%
          </span>
        </div>
        <div class="comp-barra-wrapper">
          <div class="comp-barra anterior" :style="{ width: barraWidth(item.anterior, item.atual) }"></div>
          <div class="comp-barra atual" :style="{ width: barraWidth(item.atual, item.anterior) }"></div>
        </div>
        <div class="comp-detalhe">
          <span>Anterior: {{ item.anterior }}</span>
        </div>
      </div>
    </div>

    <!-- Top mudanças por bairro -->
    <div class="mudancas-section">
      <h4 class="mudancas-titulo">Maiores Mudanças por Bairro</h4>
      <div class="mudancas-lista">
        <div v-for="m in mudancasBairro" :key="m.bairro" class="mudanca-item">
          <span class="mudanca-bairro">{{ m.bairro }}</span>
          <div class="mudanca-valores">
            <span class="mudanca-numeros">{{ m.anterior }} → {{ m.atual }}</span>
            <span
              class="mudanca-var"
              :class="m.variacao >= 0 ? 'up' : 'down'"
            >
              {{ m.variacao >= 0 ? '+' : '' }}{{ m.variacao }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { getCrimes } from '@/features/mapa-crimes/data/mockCrimes'

const crimes = getCrimes()
const modo = ref<'mes' | 'ano'>('mes')

const agora = new Date()

const periodoAtual = computed(() => {
  if (modo.value === 'mes') {
    const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1)
    const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
    return { inicio, fim }
  } else {
    const inicio = new Date(agora.getFullYear(), 0, 1)
    const fim = new Date(agora.getFullYear(), 11, 31)
    return { inicio, fim }
  }
})

const periodoAnterior = computed(() => {
  if (modo.value === 'mes') {
    const inicio = new Date(agora.getFullYear(), agora.getMonth() - 1, 1)
    const fim = new Date(agora.getFullYear(), agora.getMonth(), 0)
    return { inicio, fim }
  } else {
    const inicio = new Date(agora.getFullYear() - 1, 0, 1)
    const fim = new Date(agora.getFullYear() - 1, 11, 31)
    return { inicio, fim }
  }
})

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

const labelAtual = computed(() => {
  if (modo.value === 'mes') return `${meses[agora.getMonth()]} ${agora.getFullYear()}`
  return `${agora.getFullYear()}`
})

const labelAnterior = computed(() => {
  if (modo.value === 'mes') {
    const mesAnterior = agora.getMonth() - 1
    const ano = mesAnterior < 0 ? agora.getFullYear() - 1 : agora.getFullYear()
    const mes = mesAnterior < 0 ? 11 : mesAnterior
    return `${meses[mes]} ${ano}`
  }
  return `${agora.getFullYear() - 1}`
})

function crimesPeriodo(inicio: Date, fim: Date) {
  return crimes.filter(c => {
    const d = new Date(c.data)
    return d >= inicio && d <= fim
  })
}

const crimesAtual = computed(() => crimesPeriodo(periodoAtual.value.inicio, periodoAtual.value.fim))
const crimesAnterior = computed(() => crimesPeriodo(periodoAnterior.value.inicio, periodoAnterior.value.fim))

function calcVar(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0
  return Math.round(((atual - anterior) / anterior) * 100)
}

const metricas = computed(() => {
  const totalAtual = crimesAtual.value.length
  const totalAnterior = crimesAnterior.value.length

  const contagemTipoAtual: Record<string, number> = {}
  crimesAtual.value.forEach(c => { contagemTipoAtual[c.tipo] = (contagemTipoAtual[c.tipo] || 0) + 1 })
  const contagemTipoAnterior: Record<string, number> = {}
  crimesAnterior.value.forEach(c => { contagemTipoAnterior[c.tipo] = (contagemTipoAnterior[c.tipo] || 0) + 1 })

  const roubosAtual = contagemTipoAtual['roubo'] || 0
  const roubosAnterior = contagemTipoAnterior['roubo'] || 0

  const furtosAtual = contagemTipoAtual['furto'] || 0
  const furtosAnterior = contagemTipoAnterior['furto'] || 0

  const solAtual = crimesAtual.value.filter(c => c.status === 'solucionado').length
  const solAnterior = crimesAnterior.value.filter(c => c.status === 'solucionado').length

  return [
    {
      label: 'Total de Ocorrências',
      atual: totalAtual,
      anterior: totalAnterior,
      variacao: calcVar(totalAtual, totalAnterior),
    },
    {
      label: 'Roubos',
      atual: roubosAtual,
      anterior: roubosAnterior,
      variacao: calcVar(roubosAtual, roubosAnterior),
    },
    {
      label: 'Furtos',
      atual: furtosAtual,
      anterior: furtosAnterior,
      variacao: calcVar(furtosAtual, furtosAnterior),
    },
    {
      label: 'Solucionados',
      atual: solAtual,
      anterior: solAnterior,
      variacao: calcVar(solAtual, solAnterior),
    },
  ]
})

const mudancasBairro = computed(() => {
  const contagemAtual: Record<string, number> = {}
  const contagemAnterior: Record<string, number> = {}

  crimesAtual.value.forEach(c => { contagemAtual[c.bairro] = (contagemAtual[c.bairro] || 0) + 1 })
  crimesAnterior.value.forEach(c => { contagemAnterior[c.bairro] = (contagemAnterior[c.bairro] || 0) + 1 })

  const bairros = new Set([...Object.keys(contagemAtual), ...Object.keys(contagemAnterior)])

  return [...bairros]
    .map(bairro => {
      const atual = contagemAtual[bairro] || 0
      const anterior = contagemAnterior[bairro] || 0
      return {
        bairro,
        atual,
        anterior,
        variacao: calcVar(atual, anterior),
        mudancaAbs: Math.abs(atual - anterior),
      }
    })
    .filter(m => m.mudancaAbs > 0)
    .sort((a, b) => b.mudancaAbs - a.mudancaAbs)
    .slice(0, 5)
})

function barraWidth(valor: number, outro: number): string {
  const max = Math.max(valor, outro, 1)
  return Math.round((valor / max) * 100) + '%'
}
</script>

<style scoped>
.comparativo-container {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 1.5rem;
}

.comparativo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.comparativo-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0;
}

.modo-btns {
  display: flex;
  gap: 0;
  background: #0f172a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #334155;
}

.modo-btn {
  padding: 0.375rem 0.875rem;
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modo-btn.active {
  background: #3b82f6;
  color: white;
}

.periodo-labels {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.periodo-atual,
.periodo-anterior {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.comparativo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.comp-card {
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.comp-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.comp-valores {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comp-atual {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
}

.comp-variacao {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.comp-variacao.up {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.comp-variacao.down {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.comp-barra-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 0.25rem;
}

.comp-barra {
  height: 4px;
  border-radius: 2px;
  transition: width 0.5s ease;
  min-width: 4px;
}

.comp-barra.atual {
  background: #3b82f6;
}

.comp-barra.anterior {
  background: #475569;
}

.comp-detalhe {
  font-size: 0.6875rem;
  color: #475569;
  margin-top: 0.125rem;
}

.mudancas-section {
  border-top: 1px solid #334155;
  padding-top: 1.25rem;
}

.mudancas-titulo {
  font-size: 0.875rem;
  font-weight: 600;
  color: #e2e8f0;
  margin: 0 0 0.75rem;
}

.mudancas-lista {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mudanca-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #0f172a;
  border-radius: 8px;
}

.mudanca-bairro {
  font-size: 0.8125rem;
  color: #e2e8f0;
  font-weight: 500;
}

.mudanca-valores {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mudanca-numeros {
  font-size: 0.75rem;
  color: #64748b;
  font-variant-numeric: tabular-nums;
}

.mudanca-var {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
}

.mudanca-var.up {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.mudanca-var.down {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

@media (max-width: 600px) {
  .comparativo-grid {
    grid-template-columns: 1fr;
  }

  .comparativo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
