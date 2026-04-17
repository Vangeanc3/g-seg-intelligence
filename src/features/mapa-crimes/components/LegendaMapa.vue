<template>
  <div class="legenda">
    <template v-if="visualizacao === 'ocorrencias'">
      <div v-for="item in itensNatureza" :key="item.tipo" class="legenda-item">
        <span class="legenda-cor" :style="{ background: item.cor }"></span>
        <span class="legenda-label">{{ item.label }}</span>
      </div>

      <div class="legenda-separador"></div>
      <h4 class="legenda-subtitulo">Precisao</h4>
      <div v-for="item in itensPrecisao" :key="item.nivel" class="legenda-item">
        <span
          class="legenda-cor legenda-cor--precisao"
          :style="{
            background: item.cor,
            opacity: item.opacity,
            borderColor: item.borda,
          }"
        ></span>
        <span class="legenda-label">{{ item.label }}</span>
      </div>
    </template>

    <template v-else-if="visualizacao === 'risco-bairros'">
      <h4 class="legenda-titulo">Nivel de Risco</h4>
      <div v-for="item in itensRisco" :key="item.nivel" class="legenda-item">
        <span class="legenda-cor" :style="{ background: item.cor }"></span>
        <span class="legenda-label">{{ item.label }}</span>
      </div>
    </template>

    <template v-else-if="visualizacao === 'risco-ruas'">
      <h4 class="legenda-titulo">Ruas por Risco</h4>
      <div v-for="item in itensRisco" :key="item.nivel" class="legenda-item">
        <span class="legenda-linha" :style="{ background: item.cor }"></span>
        <span class="legenda-label">{{ item.label }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  CRIME_CORES,
  PRECISAO_COORDENADA_CORES,
  labelNatureza,
  type PrecisaoCoordenada,
  type VisualizacaoMapa,
} from '../types/crime'
import { RISCO_CORES, RISCO_LABELS, type NivelRisco } from '../services/riscoService'

defineProps<{
  visualizacao: VisualizacaoMapa
}>()

const itensNatureza = Object.entries(CRIME_CORES).map(([tipo, cor]) => ({
  tipo,
  cor,
  label: labelNatureza(tipo),
}))

const niveis: NivelRisco[] = ['Seguro', 'Baixo', 'Medio', 'Alto', 'Critico']

const itensRisco = niveis.map((nivel) => ({
  nivel,
  cor: RISCO_CORES[nivel],
  label: RISCO_LABELS[nivel],
}))

const itensPrecisao: Array<{
  nivel: PrecisaoCoordenada
  cor: string
  label: string
  opacity: number
  borda: string
}> = [
  {
    nivel: 'ALTA',
    cor: PRECISAO_COORDENADA_CORES.ALTA,
    label: 'Precisa',
    opacity: 1,
    borda: '#334155',
  },
  {
    nivel: 'MEDIA',
    cor: PRECISAO_COORDENADA_CORES.MEDIA,
    label: 'Aproximada',
    opacity: 0.7,
    borda: '#94a3b8',
  },
  {
    nivel: 'BAIXA',
    cor: PRECISAO_COORDENADA_CORES.BAIXA,
    label: 'Imprecisa',
    opacity: 0.4,
    borda: '#f59e0b',
  },
]
</script>

<style scoped>
.legenda {
  position: absolute;
  bottom: 2rem;
  right: 1rem;
  background: #1e293bdd;
  backdrop-filter: blur(8px);
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  z-index: 10;
}

.legenda-titulo {
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.legenda-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legenda-cor {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legenda-cor--precisao {
  border: 1px solid transparent;
}

.legenda-label {
  color: #cbd5e1;
  font-size: 0.75rem;
}

.legenda-linha {
  width: 20px;
  height: 4px;
  border-radius: 2px;
  display: inline-block;
}

.legenda-separador {
  height: 1px;
  background: #334155;
  margin: 0.5rem 0 0.125rem;
}

.legenda-subtitulo {
  font-size: 0.6875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin: 0 0 0.25rem;
}
</style>
