<template>
  <div class="mapa-crimes">
    <div class="mapa-crimes-sidebar">
      <FiltrosCrime
        :visualizacao="visualizacao"
        :tipos-selecionados="filtros.tipos"
        :bairros="bairrosDisponiveis"
        :total="estatisticas.total"
        :estatisticas="estatisticas"
        @update:visualizacao="(val) => visualizacao = val as 'pontos' | 'heatmap' | 'clusters'"
        @toggle-tipo="toggleTipo"
        @filtrar-bairro="filtrarBairro"
        @limpar="limparFiltros"
      />
    </div>
    <div class="mapa-crimes-content">
      <MapaInterativo
        :geojson="geojson"
        :visualizacao="visualizacao"
        @crime-click="onCrimeClick"
      />
      <LegendaMapa />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MapaInterativo from './components/MapaInterativo.vue'
import FiltrosCrime from './components/FiltrosCrime.vue'
import LegendaMapa from './components/LegendaMapa.vue'
import { useMapaCrimes } from './composables/useMapaCrimes'

const {
  filtros,
  visualizacao,
  geojson,
  bairrosDisponiveis,
  estatisticas,
  carregarCrimes,
  toggleTipo,
  limparFiltros,
} = useMapaCrimes()

function filtrarBairro(bairro: string) {
  filtros.value.bairros = bairro ? [bairro] : []
}

function onCrimeClick(properties: Record<string, unknown>) {
  console.log('Crime clicado:', properties)
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
}

.mapa-crimes-sidebar {
  width: 280px;
  flex-shrink: 0;
  overflow-y: auto;
}

.mapa-crimes-content {
  flex: 1;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}
</style>
