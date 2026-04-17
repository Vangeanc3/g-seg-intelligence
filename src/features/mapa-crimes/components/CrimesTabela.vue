<template>
  <div class="tabela-crimes-container">
    <div class="tabela-toolbar">
      <div class="toolbar-busca">
        <i class="mdi mdi-magnify"></i>
        <input
          v-model="busca"
          type="text"
          class="busca-input"
          placeholder="Buscar por bairro, natureza, categoria..."
        />
        <button v-if="busca" class="busca-limpar" @click="busca = ''">
          <i class="mdi mdi-close"></i>
        </button>
      </div>
      <span class="toolbar-total">{{ filtrados.length }} ocorrencias</span>
    </div>

    <div class="tabela-wrapper">
      <table class="crimes-table">
        <thead>
          <tr>
            <th
              v-for="col in colunas"
              :key="col.key"
              class="th-sortable"
              :class="{ active: ordenacao.campo === col.key }"
              @click="ordenarPor(col.key)"
            >
              {{ col.label }}
              <i
                v-if="ordenacao.campo === col.key"
                :class="ordenacao.asc ? 'mdi mdi-arrow-up' : 'mdi mdi-arrow-down'"
                class="sort-icon"
              ></i>
            </th>
            <th class="th-acao">Acoes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(crime, index) in paginados"
            :key="crimeKey(crime, index)"
            class="crime-row"
            @click="$emit('selecionar', crime)"
          >
            <td>
              <span
                class="tipo-tag"
                :style="{
                  color: corNatureza(crime.properties.natureza),
                  background: corNatureza(crime.properties.natureza) + '18',
                }"
              >
                {{ labelNatureza(crime.properties.natureza) }}
              </span>
            </td>
            <td class="td-bairro">{{ crime.properties.bairro }}</td>
            <td class="td-categoria">{{ crime.properties.categoria }}</td>
            <td class="td-data">{{ formatarDataCrime(crime.properties.dataFato) }}</td>
            <td class="td-hora">{{ formatarHoraCrime(crime.properties.horaFato) }}</td>
            <td class="td-precisao">
              <span
                class="precisao-tag"
                :class="precisaoClass(crime.properties.precisaoCoordenada)"
              >
                {{ labelPrecisaoCoordenadaCurta(crime.properties.precisaoCoordenada) }}
              </span>
            </td>
            <td class="td-meio">{{ crime.properties.meioEmpregado || 'Nao informado' }}</td>
            <td class="td-acao">
              <button class="btn-ver" @click.stop="$emit('selecionar', crime)" title="Ver detalhes">
                <i class="mdi mdi-eye-outline"></i>
              </button>
            </td>
          </tr>
          <tr v-if="paginados.length === 0">
            <td colspan="8" class="td-vazio">
              <div class="empty-inline">
                <i class="mdi mdi-magnify-close"></i>
                <span>Nenhuma ocorrencia encontrada</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPaginas > 1" class="paginacao">
      <button class="pag-btn" :disabled="pagina === 1" title="Primeira" @click="pagina = 1">
        <i class="mdi mdi-chevron-double-left"></i>
      </button>
      <button class="pag-btn" :disabled="pagina === 1" title="Anterior" @click="pagina--">
        <i class="mdi mdi-chevron-left"></i>
      </button>

      <template v-for="p in paginasVisiveis" :key="p">
        <button v-if="p === '...'" class="pag-btn pag-dots" disabled>...</button>
        <button
          v-else
          class="pag-btn pag-num"
          :class="{ active: pagina === p }"
          @click="pagina = p as number"
        >
          {{ p }}
        </button>
      </template>

      <button
        class="pag-btn"
        :disabled="pagina === totalPaginas"
        title="Proxima"
        @click="pagina++"
      >
        <i class="mdi mdi-chevron-right"></i>
      </button>
      <button
        class="pag-btn"
        :disabled="pagina === totalPaginas"
        title="Ultima"
        @click="pagina = totalPaginas"
      >
        <i class="mdi mdi-chevron-double-right"></i>
      </button>

      <span class="pag-info">
        {{ (pagina - 1) * porPagina + 1 }}-{{ Math.min(pagina * porPagina, filtrados.length) }}
        de {{ filtrados.length }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  chaveCrime,
  corNatureza,
  formatarDataCrime,
  formatarHoraCrime,
  labelNatureza,
  labelPrecisaoCoordenada,
  labelPrecisaoCoordenadaCurta,
  normalizarPrecisaoCoordenada,
  type CrimeFeature,
} from '../types/crime'

type CampoOrdenacao =
  | 'natureza'
  | 'bairro'
  | 'categoria'
  | 'dataFato'
  | 'horaFato'
  | 'precisaoCoordenada'
  | 'meioEmpregado'

const props = defineProps<{
  crimes: CrimeFeature[]
}>()

defineEmits<{
  selecionar: [crime: CrimeFeature]
}>()

const busca = ref('')
const porPagina = 20
const pagina = ref(1)
const ordenacao = ref<{ campo: CampoOrdenacao; asc: boolean }>({
  campo: 'dataFato',
  asc: false,
})

const colunas: Array<{ key: CampoOrdenacao; label: string }> = [
  { key: 'natureza', label: 'Natureza' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'dataFato', label: 'Data' },
  { key: 'horaFato', label: 'Hora' },
  { key: 'precisaoCoordenada', label: 'Precisao' },
  { key: 'meioEmpregado', label: 'Meio Empregado' },
]

function crimeKey(crime: CrimeFeature, index: number): string {
  return `${chaveCrime(crime)}-${index}`
}

function getValorOrdenacao(crime: CrimeFeature, campo: CampoOrdenacao): string | number {
  const { properties } = crime

  switch (campo) {
    case 'dataFato':
      return new Date(properties.dataFato).getTime()
    case 'horaFato':
      return properties.horaFato || ''
    case 'natureza':
      return labelNatureza(properties.natureza)
    case 'bairro':
      return properties.bairro
    case 'categoria':
      return properties.categoria
    case 'meioEmpregado':
      return properties.meioEmpregado || ''
    case 'precisaoCoordenada':
      switch (normalizarPrecisaoCoordenada(properties.precisaoCoordenada)) {
        case 'ALTA':
          return 1
        case 'MEDIA':
          return 2
        case 'BAIXA':
          return 3
      }
  }
}

const filtrados = computed(() => {
  let resultado = [...props.crimes]

  if (busca.value.trim()) {
    const termo = busca.value.toLowerCase()

    resultado = resultado.filter((crime) => {
      const { properties } = crime

      return (
        properties.bairro.toLowerCase().includes(termo) ||
        properties.categoria.toLowerCase().includes(termo) ||
        properties.natureza.toLowerCase().includes(termo) ||
        labelNatureza(properties.natureza).toLowerCase().includes(termo) ||
        labelPrecisaoCoordenada(properties.precisaoCoordenada)
          .toLowerCase()
          .includes(termo) ||
        labelPrecisaoCoordenadaCurta(properties.precisaoCoordenada)
          .toLowerCase()
          .includes(termo) ||
        (properties.meioEmpregado || '').toLowerCase().includes(termo)
      )
    })
  }

  resultado.sort((a, b) => {
    let valorA = getValorOrdenacao(a, ordenacao.value.campo)
    let valorB = getValorOrdenacao(b, ordenacao.value.campo)

    if (typeof valorA === 'string') valorA = valorA.toLowerCase()
    if (typeof valorB === 'string') valorB = valorB.toLowerCase()

    if (valorA < valorB) return ordenacao.value.asc ? -1 : 1
    if (valorA > valorB) return ordenacao.value.asc ? 1 : -1
    return 0
  })

  return resultado
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(filtrados.value.length / porPagina)))

const paginados = computed(() => {
  const inicio = (pagina.value - 1) * porPagina
  return filtrados.value.slice(inicio, inicio + porPagina)
})

const paginasVisiveis = computed(() => {
  const total = totalPaginas.value
  const atual = pagina.value
  const result: Array<number | string> = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) result.push(i)
  } else {
    result.push(1)
    if (atual > 3) result.push('...')
    for (let i = Math.max(2, atual - 1); i <= Math.min(total - 1, atual + 1); i++) {
      result.push(i)
    }
    if (atual < total - 2) result.push('...')
    result.push(total)
  }

  return result
})

watch([busca, () => props.crimes], () => {
  pagina.value = 1
})

function ordenarPor(campo: CampoOrdenacao) {
  if (ordenacao.value.campo === campo) {
    ordenacao.value.asc = !ordenacao.value.asc
  } else {
    ordenacao.value = { campo, asc: true }
  }

  pagina.value = 1
}

function precisaoClass(precisao: string): string {
  switch (normalizarPrecisaoCoordenada(precisao)) {
    case 'ALTA':
      return 'precisao-alta'
    case 'MEDIA':
      return 'precisao-media'
    case 'BAIXA':
      return 'precisao-baixa'
  }
}
</script>

<style scoped>
.tabela-crimes-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #0f172a;
}

.tabela-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  gap: 1rem;
  flex-shrink: 0;
}

.toolbar-busca {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 400px;
}

.toolbar-busca > i {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  pointer-events: none;
}

.busca-input {
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 2.25rem;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.8125rem;
  outline: none;
  transition: border-color 0.2s;
}

.busca-input:focus {
  border-color: #3b82f6;
}

.busca-input::placeholder {
  color: #475569;
}

.busca-limpar {
  position: absolute;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0.125rem;
}

.toolbar-total {
  font-size: 0.8125rem;
  color: #64748b;
  white-space: nowrap;
}

.tabela-wrapper {
  flex: 1;
  overflow: auto;
}

.crimes-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
}

.crimes-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #1e293b;
}

.crimes-table th {
  text-align: left;
  padding: 0.625rem 0.75rem;
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #334155;
  white-space: nowrap;
  user-select: none;
}

.th-sortable {
  cursor: pointer;
  transition: color 0.2s;
}

.th-sortable:hover {
  color: #94a3b8;
}

.th-sortable.active {
  color: #3b82f6;
}

.sort-icon {
  font-size: 0.75rem;
  margin-left: 0.25rem;
}

.th-acao {
  width: 50px;
  text-align: center;
  cursor: default;
}

.crimes-table td {
  padding: 0.625rem 0.75rem;
  font-size: 0.8125rem;
  color: #e2e8f0;
  border-bottom: 1px solid rgba(51, 65, 85, 0.4);
}

.crime-row {
  cursor: pointer;
  transition: background 0.15s;
}

.crime-row:hover {
  background: rgba(59, 130, 246, 0.05);
}

.tipo-tag {
  display: inline-block;
  padding: 0.1875rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.td-bairro {
  font-weight: 500;
}

.td-categoria,
.td-meio {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #94a3b8;
}

.td-data,
.td-hora,
.td-precisao {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.td-data,
.td-hora {
  color: #94a3b8;
}

.precisao-tag {
  display: inline-block;
  padding: 0.125rem 0.375rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.precisao-alta {
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
}

.precisao-media {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.precisao-baixa {
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
}

.td-acao {
  text-align: center;
}

.btn-ver {
  background: transparent;
  border: 1px solid #334155;
  color: #94a3b8;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-ver:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.td-vazio {
  text-align: center;
  padding: 2rem !important;
}

.empty-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
}

.empty-inline i {
  font-size: 1.25rem;
}

.paginacao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: #1e293b;
  border-top: 1px solid #334155;
  flex-shrink: 0;
}

.pag-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  color: #94a3b8;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pag-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.1);
  color: #e2e8f0;
}

.pag-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.pag-num {
  font-weight: 500;
}

.pag-num.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.pag-dots {
  cursor: default;
  color: #475569;
}

.pag-info {
  margin-left: 1rem;
  font-size: 0.75rem;
  color: #64748b;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .tabela-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-busca {
    max-width: none;
  }

  .paginacao {
    flex-wrap: wrap;
  }

  .pag-info {
    margin-left: 0;
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }
}
</style>
