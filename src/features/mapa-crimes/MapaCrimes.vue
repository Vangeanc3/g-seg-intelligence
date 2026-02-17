<template>
  <div class="mapa-crimes">
    <div class="mapa-crimes-sidebar" :class="{ 'filtros-abertos': filtrosAbertos }">
      <!-- Toggle de filtros mobile -->
      <div class="filtros-toggle" @click="filtrosAbertos = !filtrosAbertos">
        <i class="mdi mdi-chevron-up"></i>
        <span>Filtros (<AnimatedNumber :valor="estatisticas.total" :duracao="500" /> ocorrências)</span>
      </div>

      <FiltrosCrime
        :visualizacao="visualizacao"
        :tipos-selecionados="filtros.tipos"
        :bairros="bairrosDisponiveis"
        :total="estatisticas.total"
        :estatisticas="estatisticas"
        :data-inicio="filtros.dataInicio"
        :data-fim="filtros.dataFim"
        @update:visualizacao="(val) => visualizacao = val as 'pontos' | 'heatmap' | 'clusters'"
        @update:data-inicio="filtros.dataInicio = $event"
        @update:data-fim="filtros.dataFim = $event"
        @toggle-tipo="toggleTipo"
        @filtrar-bairro="filtrarBairro"
        @limpar="limparFiltros"
      />
    </div>

    <!-- Área principal com tabs -->
    <div class="mapa-crimes-main">
      <!-- Tabs Mapa | Lista -->
      <div class="view-tabs">
        <button
          class="view-tab"
          :class="{ active: viewMode === 'mapa' }"
          @click="viewMode = 'mapa'"
        >
          <i class="mdi mdi-map"></i>
          Mapa
        </button>
        <button
          class="view-tab"
          :class="{ active: viewMode === 'lista' }"
          @click="viewMode = 'lista'"
        >
          <i class="mdi mdi-format-list-bulleted"></i>
          Lista
        </button>
      </div>

      <!-- View: Mapa -->
      <div v-if="viewMode === 'mapa'" class="mapa-crimes-content">
        <MapaInterativo
          ref="mapaRef"
          :geojson="geojson"
          :visualizacao="visualizacao"
          @crime-click="onCrimeClick"
        />
        <BuscaEndereco @selecionar="onBuscaSelecionar" />
        <LegendaMapa />
      </div>

      <!-- View: Lista -->
      <CrimesTabela
        v-else
        :crimes="crimesFiltrados"
        @selecionar="onCrimeSelecionadoTabela"
      />

      <!-- Modal compartilhado entre mapa e lista -->
      <CrimeDetalhesModal
        :crime="crimeSelecionado"
        @fechar="crimeSelecionado = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import MapaInterativo from './components/MapaInterativo.vue'
import FiltrosCrime from './components/FiltrosCrime.vue'
import LegendaMapa from './components/LegendaMapa.vue'
import CrimeDetalhesModal from './components/CrimeDetalhesModal.vue'
import BuscaEndereco from './components/BuscaEndereco.vue'
import CrimesTabela from './components/CrimesTabela.vue'
import { useMapaCrimes } from './composables/useMapaCrimes'
import type { Crime } from './types/crime'

const {
  filtros,
  visualizacao,
  geojson,
  bairrosDisponiveis,
  estatisticas,
  crimesFiltrados,
  carregarCrimes,
  toggleTipo,
  limparFiltros,
} = useMapaCrimes()

const crimeSelecionado = ref<Crime | null>(null)
const filtrosAbertos = ref(false)
const mapaRef = ref<InstanceType<typeof MapaInterativo> | null>(null)
const viewMode = ref<'mapa' | 'lista'>('mapa')

function filtrarBairro(bairro: string) {
  filtros.value.bairros = bairro ? [bairro] : []
}

function onCrimeClick(properties: Record<string, unknown>) {
  const crime = crimesFiltrados.value.find(c => c.id === properties.id)
  if (crime) {
    crimeSelecionado.value = crime
  }
}

function onCrimeSelecionadoTabela(crime: Crime) {
  crimeSelecionado.value = crime
}

function onBuscaSelecionar(coords: { lng: number; lat: number; nome: string; zoom: number }) {
  mapaRef.value?.irParaCoordenada(coords)
}

onMounted(() => {
  carregarCrimes()
})
</script>

<style scoped>
.mapa-crimes {
  display: flex;
  height: calc(100vh - 64px);
  gap: 1rem;
  padding: 1rem;
  background: #0f172a;
}

.mapa-crimes-sidebar {
  width: 280px;
  flex-shrink: 0;
  height: 100%;
  overflow: hidden;
}

.mapa-crimes-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
}

.view-tabs {
  display: flex;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  padding: 0 1rem;
  flex-shrink: 0;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: -1px;
}

.view-tab:hover {
  color: #94a3b8;
}

.view-tab.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.mapa-crimes-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.filtros-toggle {
  display: none;
}

@media (max-width: 768px) {
  .mapa-crimes {
    flex-direction: column;
    padding: 0;
    gap: 0;
  }

  .mapa-crimes-sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 60vh;
    border-radius: 16px 16px 0 0;
    border-top: 1px solid #334155;
    z-index: 30;
    overflow-y: auto;
    transform: translateY(calc(100% - 48px));
    transition: transform 0.3s ease;
    background: #1e293b;
  }

  .mapa-crimes-sidebar.filtros-abertos {
    transform: translateY(0);
  }

  .filtros-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    cursor: pointer;
    color: #94a3b8;
    font-size: 0.8125rem;
    border-bottom: 1px solid #334155;
  }

  .filtros-toggle i {
    transition: transform 0.3s;
  }

  .filtros-abertos .filtros-toggle i {
    transform: rotate(180deg);
  }

  .mapa-crimes-main {
    height: calc(100vh - 3.5rem);
    width: 100%;
    border-radius: 0;
  }
}
</style>
