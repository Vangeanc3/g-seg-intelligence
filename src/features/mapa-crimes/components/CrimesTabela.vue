<template>
  <div class="tabela-crimes-container">
    <!-- Barra de busca e info -->
    <div class="tabela-toolbar">
      <div class="toolbar-busca">
        <i class="mdi mdi-magnify"></i>
        <input
          v-model="busca"
          type="text"
          class="busca-input"
          placeholder="Buscar por endereço, bairro, tipo..."
        />
        <button v-if="busca" class="busca-limpar" @click="busca = ''">
          <i class="mdi mdi-close"></i>
        </button>
      </div>
      <span class="toolbar-total">
        {{ filtrados.length }} ocorrências
      </span>
    </div>

    <!-- Tabela -->
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
            <th class="th-acao">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="crime in paginados"
            :key="crime.id"
            class="crime-row"
            @click="$emit('selecionar', crime)"
          >
            <td>
              <span class="tipo-tag" :style="{ color: corTipo(crime.tipo), background: corTipo(crime.tipo) + '18' }">
                {{ labelTipo(crime.tipo) }}
              </span>
            </td>
            <td class="td-bairro">{{ crime.bairro }}</td>
            <td class="td-endereco">{{ crime.endereco }}</td>
            <td class="td-data">{{ formatarData(crime.data) }}</td>
            <td class="td-hora">{{ formatarHora(crime.data) }}</td>
            <td>
              <span class="status-tag" :style="{ color: corStatus(crime.status), background: corStatus(crime.status) + '18' }">
                {{ labelStatus(crime.status) }}
              </span>
            </td>
            <td class="td-acao">
              <button class="btn-ver" @click.stop="$emit('selecionar', crime)" title="Ver detalhes">
                <i class="mdi mdi-eye-outline"></i>
              </button>
            </td>
          </tr>
          <tr v-if="paginados.length === 0">
            <td colspan="7" class="td-vazio">
              <div class="empty-inline">
                <i class="mdi mdi-magnify-close"></i>
                <span>Nenhuma ocorrência encontrada</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div v-if="totalPaginas > 1" class="paginacao">
      <button
        class="pag-btn"
        :disabled="pagina === 1"
        @click="pagina = 1"
        title="Primeira"
      >
        <i class="mdi mdi-chevron-double-left"></i>
      </button>
      <button
        class="pag-btn"
        :disabled="pagina === 1"
        @click="pagina--"
        title="Anterior"
      >
        <i class="mdi mdi-chevron-left"></i>
      </button>

      <template v-for="p in paginasVisiveis" :key="p">
        <button
          v-if="p === '...'"
          class="pag-btn pag-dots"
          disabled
        >...</button>
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
        @click="pagina++"
        title="Próxima"
      >
        <i class="mdi mdi-chevron-right"></i>
      </button>
      <button
        class="pag-btn"
        :disabled="pagina === totalPaginas"
        @click="pagina = totalPaginas"
        title="Última"
      >
        <i class="mdi mdi-chevron-double-right"></i>
      </button>

      <span class="pag-info">
        {{ (pagina - 1) * porPagina + 1 }}–{{ Math.min(pagina * porPagina, filtrados.length) }}
        de {{ filtrados.length }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Crime } from '../types/crime'
import { CRIME_LABELS, CRIME_CORES } from '../types/crime'

const props = defineProps<{
  crimes: Crime[]
}>()

defineEmits<{
  selecionar: [crime: Crime]
}>()

const busca = ref('')
const porPagina = 20
const pagina = ref(1)
const ordenacao = ref<{ campo: string; asc: boolean }>({ campo: 'data', asc: false })

const colunas = [
  { key: 'tipo', label: 'Tipo' },
  { key: 'bairro', label: 'Bairro' },
  { key: 'endereco', label: 'Endereço' },
  { key: 'data', label: 'Data' },
  { key: 'hora', label: 'Hora' },
  { key: 'status', label: 'Status' },
]

const filtrados = computed(() => {
  let resultado = [...props.crimes]

  if (busca.value.trim()) {
    const termo = busca.value.toLowerCase()
    resultado = resultado.filter(c =>
      c.endereco.toLowerCase().includes(termo) ||
      c.bairro.toLowerCase().includes(termo) ||
      (CRIME_LABELS[c.tipo as keyof typeof CRIME_LABELS] || c.tipo).toLowerCase().includes(termo) ||
      c.id.toLowerCase().includes(termo)
    )
  }

  resultado.sort((a, b) => {
    const campo = ordenacao.value.campo
    let va: string | number, vb: string | number

    if (campo === 'hora') {
      va = new Date(a.data).getHours() * 60 + new Date(a.data).getMinutes()
      vb = new Date(b.data).getHours() * 60 + new Date(b.data).getMinutes()
    } else {
      va = (a as Record<string, string | number>)[campo] ?? ''
      vb = (b as Record<string, string | number>)[campo] ?? ''
    }

    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()

    if (va < vb) return ordenacao.value.asc ? -1 : 1
    if (va > vb) return ordenacao.value.asc ? 1 : -1
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
  const result: (number | string)[] = []

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

watch([busca, () => props.crimes], () => { pagina.value = 1 })

function ordenarPor(campo: string) {
  if (ordenacao.value.campo === campo) {
    ordenacao.value.asc = !ordenacao.value.asc
  } else {
    ordenacao.value = { campo, asc: true }
  }
  pagina.value = 1
}

function labelTipo(tipo: string): string {
  return CRIME_LABELS[tipo as keyof typeof CRIME_LABELS] || tipo
}

function corTipo(tipo: string): string {
  return CRIME_CORES[tipo as keyof typeof CRIME_CORES] || '#6b7280'
}

function labelStatus(status: string): string {
  const labels: Record<string, string> = {
    aberto: 'Aberto',
    em_investigacao: 'Em Investigação',
    solucionado: 'Solucionado',
  }
  return labels[status] || status
}

function corStatus(status: string): string {
  const cores: Record<string, string> = {
    aberto: '#ef4444',
    em_investigacao: '#f59e0b',
    solucionado: '#22c55e',
  }
  return cores[status] || '#6b7280'
}

function formatarData(data: string): string {
  return new Date(data).toLocaleDateString('pt-BR')
}

function formatarHora(data: string): string {
  return new Date(data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
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
  min-width: 700px;
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

.tipo-tag,
.status-tag {
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

.td-endereco {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #94a3b8;
}

.td-data,
.td-hora {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  color: #94a3b8;
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

/* Paginação */
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
