<template>
  <div class="busca-container">
    <div class="busca-input-wrapper">
      <i class="mdi mdi-magnify busca-icon"></i>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        class="busca-input"
        placeholder="Buscar endereço em Belém..."
        @input="onInput"
        @focus="mostrarResultados = true"
        @keydown.escape="limpar"
        @keydown.enter="selecionarPrimeiro"
      />
      <button v-if="query" class="busca-limpar" @click="limpar">
        <i class="mdi mdi-close"></i>
      </button>
    </div>

    <!-- Resultados -->
    <transition name="dropdown">
      <div v-if="mostrarResultados && resultados.length > 0" class="busca-resultados">
        <div
          v-for="(r, i) in resultados"
          :key="i"
          class="busca-resultado-item"
          @click="selecionar(r)"
        >
          <i class="mdi mdi-map-marker resultado-icon"></i>
          <div class="resultado-texto">
            <span class="resultado-principal">{{ r.text }}</span>
            <span class="resultado-secundario">{{ r.place_name }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Loading -->
    <div v-if="buscando" class="busca-loading">
      <i class="mdi mdi-loading mdi-spin"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

interface GeocodingResult {
  text: string
  place_name: string
  center: [number, number] // [lng, lat]
}

const emit = defineEmits<{
  selecionar: [coords: { lng: number; lat: number; nome: string; zoom: number }]
}>()

const query = ref('')
const resultados = ref<GeocodingResult[]>([])
const mostrarResultados = ref(false)
const buscando = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || ''

async function buscar(texto: string) {
  if (texto.length < 3) {
    resultados.value = []
    return
  }

  buscando.value = true

  try {
    const params = new URLSearchParams({
      access_token: MAPBOX_TOKEN,
      language: 'pt-BR',
      country: 'BR',
      bbox: '-48.65,-1.55,-48.30,-1.10', // Bounding box de Belém
      limit: '5',
      types: 'address,poi,neighborhood,place',
    })

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(texto)}.json?${params}`
    const response = await fetch(url)
    const data = await response.json()

    resultados.value = (data.features || []).map((f: any) => ({
      text: f.text,
      place_name: f.place_name,
      center: f.center,
    }))
  } catch (e) {
    console.error('Erro no geocoding:', e)
    resultados.value = []
  } finally {
    buscando.value = false
  }
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => buscar(query.value), 300)
}

function selecionar(resultado: GeocodingResult) {
  query.value = resultado.text
  mostrarResultados.value = false
  resultados.value = []

  emit('selecionar', {
    lng: resultado.center[0],
    lat: resultado.center[1],
    nome: resultado.place_name,
    zoom: 16,
  })
}

function selecionarPrimeiro() {
  if (resultados.value.length > 0) {
    selecionar(resultados.value[0]!)
  }
}

function limpar() {
  query.value = ''
  resultados.value = []
  mostrarResultados.value = false
  inputRef.value?.focus()
}

// Fechar dropdown ao clicar fora
function onClickOutside(e: Event) {
  const el = (e.target as HTMLElement)
  if (!el.closest('.busca-container')) {
    mostrarResultados.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.busca-container {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 15;
  width: 320px;
}

.busca-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.busca-icon {
  position: absolute;
  left: 0.75rem;
  color: #64748b;
  font-size: 1.125rem;
  pointer-events: none;
}

.busca-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.busca-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
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
  padding: 0.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.busca-limpar:hover {
  color: #e2e8f0;
}

.busca-loading {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #3b82f6;
  font-size: 1rem;
}

/* Resultados dropdown */
.busca-resultados {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  right: 0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.busca-resultado-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.15s;
}

.busca-resultado-item:hover {
  background: rgba(59, 130, 246, 0.1);
}

.busca-resultado-item:not(:last-child) {
  border-bottom: 1px solid rgba(51, 65, 85, 0.5);
}

.resultado-icon {
  color: #3b82f6;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.resultado-texto {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.resultado-principal {
  font-size: 0.875rem;
  color: #e2e8f0;
  font-weight: 500;
}

.resultado-secundario {
  font-size: 0.6875rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Animação dropdown */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Mobile */
@media (max-width: 768px) {
  .busca-container {
    width: calc(100% - 2rem);
    top: 0.75rem;
    left: 1rem;
  }
}
</style>
