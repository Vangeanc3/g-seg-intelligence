<template>
  <div class="mapa-crimes">
    <div class="mapa-crimes-sidebar" :class="{ 'filtros-abertos': filtrosAbertos }">
      <div class="filtros-toggle" @click="filtrosAbertos = !filtrosAbertos">
        <i class="mdi mdi-chevron-up"></i>
        <span>Filtros (<AnimatedNumber :valor="totalCrimes" :duracao="500" /> ocorrencias)</span>
      </div>

      <FiltrosCrime
        :visualizacao="visualizacao"
        :natureza-selecionada="filtros.natureza"
        :bairro-selecionado="filtros.bairro"
        :bairros="bairrosDisponiveis"
        :total="totalCrimes"
        :tipos-crime="tiposCrime"
        :data-inicio="filtros.dataInicio"
        :data-fim="filtros.dataFim"
        :carregando="carregando"
        @update:visualizacao="(val) => visualizacao = val"
        @update:natureza="filtros.natureza = $event"
        @update:bairro="filtros.bairro = $event"
        @update:data-inicio="filtros.dataInicio = $event"
        @update:data-fim="filtros.dataFim = $event"
        @limpar="limparFiltros"
      />
    </div>

    <div class="mapa-crimes-main">
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

      <div v-if="erro" class="status-banner">
        <ErrorMessage :message="erro" />
        <button class="btn-recarregar" @click="void recarregar()">Tentar novamente</button>
      </div>

      <div v-if="viewMode === 'mapa'" class="mapa-crimes-content">
        <MapaInterativo
          ref="mapaRef"
          :geojson="geojson"
          :bairros-poligonos="bairrosPoligonos"
          :visualizacao="visualizacao"
          @crime-click="crimeSelecionado = $event"
        />
        <BuscaEndereco @selecionar="onBuscaSelecionar" />
        <LegendaMapa :visualizacao="visualizacao" />

        <div v-if="carregando" class="loading-overlay">
          <LoadingSpinner size="sm" text="Carregando crimes..." />
        </div>
      </div>

      <div v-else class="lista-content">
        <CrimesTabela :crimes="crimesFiltrados" @selecionar="crimeSelecionado = $event" />

        <div v-if="carregando" class="loading-overlay loading-overlay--lista">
          <LoadingSpinner size="sm" text="Carregando crimes..." />
        </div>
      </div>

      <CrimeDetalhesModal :crime="crimeSelecionado" @fechar="crimeSelecionado = null" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AnimatedNumber from '@/shared/components/AnimatedNumber.vue'
import ErrorMessage from '@/shared/components/ErrorMessage.vue'
import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
import MapaInterativo from './components/MapaInterativo.vue'
import FiltrosCrime from './components/FiltrosCrime.vue'
import LegendaMapa from './components/LegendaMapa.vue'
import CrimeDetalhesModal from './components/CrimeDetalhesModal.vue'
import BuscaEndereco from './components/BuscaEndereco.vue'
import CrimesTabela from './components/CrimesTabela.vue'
import { useMapaCrimes } from './composables/useMapaCrimes'
import {
  chaveCrime,
  type CrimeFeature,
  type VisualizacaoMapa,
} from './types/crime'

const visualizacao = ref<VisualizacaoMapa>('ocorrencias')
const {
  filtros,
  geojson,
  bairrosPoligonos,
  bairrosDisponiveis,
  totalCrimes,
  tiposCrime,
  crimesFiltrados,
  carregando,
  erro,
  limparFiltros,
  recarregar,
} = useMapaCrimes()

const crimeSelecionado = ref<CrimeFeature | null>(null)
const filtrosAbertos = ref(false)
const mapaRef = ref<InstanceType<typeof MapaInterativo> | null>(null)
const viewMode = ref<'mapa' | 'lista'>('mapa')

watch(crimesFiltrados, (crimes) => {
  if (!crimeSelecionado.value) return

  const selecionadoAindaExiste = crimes.some(
    (crime) => chaveCrime(crime) === chaveCrime(crimeSelecionado.value!),
  )

  if (!selecionadoAindaExiste) {
    crimeSelecionado.value = null
  }
})

function onBuscaSelecionar(coords: {
  lng: number
  lat: number
  nome: string
  zoom: number
}) {
  mapaRef.value?.irParaCoordenada(coords)
}
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

.status-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #0f172a;
  border-bottom: 1px solid #334155;
}

.btn-recarregar {
  flex-shrink: 0;
  padding: 0.625rem 1rem;
  border: 1px solid #334155;
  background: transparent;
  color: #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-recarregar:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.mapa-crimes-content,
.lista-content {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.filtros-toggle {
  display: none;
}

.loading-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 15;
  padding: 0.75rem 1rem;
  border: 1px solid #334155;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.92);
  backdrop-filter: blur(8px);
}

.loading-overlay--lista {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

  .status-banner {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
