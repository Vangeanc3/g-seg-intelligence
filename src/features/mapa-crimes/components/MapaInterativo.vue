<template>
  <div class="mapa-container">
    <div ref="mapContainer" class="mapa"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { createMask } from '../utils/maskHelper'
import {
  CRIME_CORES,
  corPrecisaoCoordenada,
  formatarDataCrime,
  labelNatureza,
  labelPrecisaoCoordenada,
  normalizarPrecisaoCoordenada,
  type CrimeFeature,
  type CrimesGeoJson,
  type CrimeProperties,
  type VisualizacaoMapa,
} from '../types/crime'
import {
  RISCO_CORES,
  RISCO_LABELS,
  type BairrosPoligonosGeoJson,
  type NivelRisco,
  type RuasRiscoGeoJson,
} from '../services/riscoService'

const TERRA_FIRME_CENTER: [number, number] = [-48.4513, -1.456]
const DEFAULT_ZOOM = 15
const TIPOS_RUA_LABELS: Record<string, string> = {
  residential: 'Residencial',
  primary: 'Principal',
  secondary: 'Secundária',
  tertiary: 'Terciária',
  service: 'Serviço',
  unclassified: 'Sem classificação',
  living_street: 'Via local',
}

interface Props {
  geojson: CrimesGeoJson
  bairrosPoligonos: BairrosPoligonosGeoJson
  ruasRisco: RuasRiscoGeoJson
  visualizacao: VisualizacaoMapa
}

const props = defineProps<Props>()
const emit = defineEmits<{
  crimeClick: [crime: CrimeFeature]
}>()

const mapContainer = ref<HTMLDivElement>()
let map: mapboxgl.Map | null = null
let searchMarker: mapboxgl.Marker | null = null
let hoveredBairroId: number | null = null
let hoveredRuaId: number | null = null

function initMap() {
  if (!mapContainer.value) return

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/dark-v11',
    center: TERRA_FIRME_CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: 10,
    maxZoom: 18,
    maxBounds: [
      [-48.65, -1.55],
      [-48.3, -1.1],
    ],
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

  map.on('load', async () => {
    await addBelemBoundary()
    addSources()
    addLayers()
    setupEvents()

    // Garante a visualizacao inicial assim que o mapa termina de montar
    aplicarVisualizacao(props.visualizacao)
  })
}

async function addBelemBoundary() {
  if (!map) return

  try {
    const response = await fetch('/data/belem_boundary.geojson')
    const belemData: GeoJSON.FeatureCollection = await response.json()
    const mask = createMask(belemData)

    map.addSource('belem-mask', {
      type: 'geojson',
      data: mask,
    })

    map.addLayer({
      id: 'mask-layer',
      type: 'fill',
      source: 'belem-mask',
      paint: {
        'fill-color': '#0f172a',
        'fill-opacity': 0.7,
      },
    })

    map.addSource('belem-boundary', {
      type: 'geojson',
      data: belemData,
    })

    map.addLayer({
      id: 'belem-border',
      type: 'line',
      source: 'belem-boundary',
      paint: {
        'line-color': '#3b82f6',
        'line-width': 2,
        'line-opacity': 0.8,
      },
    })
  } catch (error) {
    console.error('Erro ao carregar boundary de Belem:', error)
  }
}

function addSources() {
  if (!map) return

  map.addSource('crimes', {
    type: 'geojson',
    data: props.geojson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  })

  map.addSource('bairros-poligonos', {
    type: 'geojson',
    data: normalizarBairrosPoligonos(props.bairrosPoligonos),
  })

  map.addSource('ruas-risco', {
    type: 'geojson',
    data: normalizarRuasRisco(props.ruasRisco),
  })
}

function addLayers() {
  if (!map) return

  const precisaoExpression = ['coalesce', ['get', 'precisaoCoordenada'], 'ALTA']

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'crimes',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 6,
      'circle-color': [
        'match',
        ['coalesce', ['get', 'natureza'], ''],
        'FURTO',
        CRIME_CORES.FURTO,
        'ROUBO',
        CRIME_CORES.ROUBO,
        'LESAO CORPORAL',
        CRIME_CORES['LESAO CORPORAL'],
        'TRAFICO DE DROGAS',
        CRIME_CORES['TRAFICO DE DROGAS'],
        'ESTUPRO DE VULNERAVEL',
        CRIME_CORES['ESTUPRO DE VULNERAVEL'],
        'HOMICIDIO',
        CRIME_CORES.HOMICIDIO,
        'MORTE NO TRANSITO',
        CRIME_CORES['MORTE NO TRANSITO'],
        'ESTUPRO',
        CRIME_CORES.ESTUPRO,
        '#64748b',
      ],
      'circle-stroke-width': [
        'match',
        precisaoExpression,
        'BAIXA',
        2,
        'MEDIA',
        1,
        1,
      ],
      'circle-stroke-color': [
        'match',
        precisaoExpression,
        'BAIXA',
        '#f59e0b',
        'MEDIA',
        '#94a3b8',
        '#334155',
      ],
      'circle-opacity': [
        'match',
        precisaoExpression,
        'ALTA',
        1,
        'MEDIA',
        0.7,
        'BAIXA',
        0.4,
        0.8,
      ],
    },
    layout: {
      visibility: 'none',
    },
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'crimes',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#3b82f6',
        10,
        '#f59e0b',
        50,
        '#ef4444',
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10,
        30,
        50,
        40,
      ],
      'circle-opacity': 0.75,
    },
    layout: {
      visibility: 'none',
    },
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'crimes',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14,
      visibility: 'none',
    },
    paint: {
      'text-color': '#ffffff',
    },
  })

  map.addLayer({
    id: 'bairros-fill',
    type: 'fill',
    source: 'bairros-poligonos',
    paint: {
      'fill-color': [
        'match',
        ['get', 'nivelRisco'],
        'Seguro',
        RISCO_CORES.Seguro,
        'Baixo',
        RISCO_CORES.Baixo,
        'Medio',
        RISCO_CORES.Medio,
        'Alto',
        RISCO_CORES.Alto,
        'Critico',
        RISCO_CORES.Critico,
        '#64748b',
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.75,
        0.55,
      ],
    },
    layout: { visibility: 'none' },
  })

  map.addLayer({
    id: 'bairros-line',
    type: 'line',
    source: 'bairros-poligonos',
    paint: {
      'line-color': '#ffffff',
      'line-width': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        2.5,
        1,
      ],
      'line-opacity': 0.7,
    },
    layout: { visibility: 'none' },
  })

  map.addLayer({
    id: 'bairros-labels',
    type: 'symbol',
    source: 'bairros-poligonos',
    layout: {
      'text-field': ['get', 'nomeDisplay'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-size': 12,
      'text-anchor': 'center',
      'symbol-placement': 'point',
      visibility: 'none',
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': '#000000',
      'text-halo-width': 1.5,
    },
  })

  map.addLayer({
    id: 'ruas-risco-line',
    type: 'line',
    source: 'ruas-risco',
    paint: {
      'line-color': [
        'match',
        ['get', 'nivelRisco'],
        'Seguro',
        RISCO_CORES.Seguro,
        'Baixo',
        RISCO_CORES.Baixo,
        'Medio',
        RISCO_CORES.Medio,
        'Alto',
        RISCO_CORES.Alto,
        'Critico',
        RISCO_CORES.Critico,
        '#64748b',
      ],
      'line-width': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10,
        2,
        14,
        4,
        16,
        6,
        18,
        10,
      ],
      'line-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.85,
      ],
    },
    layout: {
      visibility: 'none',
      'line-cap': 'round',
      'line-join': 'round',
    },
  })

  map.addLayer(
    {
      id: 'ruas-risco-halo',
      type: 'line',
      source: 'ruas-risco',
      paint: {
        'line-color': '#ffffff',
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          14,
          0,
        ],
        'line-opacity': 0.3,
        'line-blur': 2,
      },
      layout: {
        visibility: 'none',
        'line-cap': 'round',
        'line-join': 'round',
      },
    },
    'ruas-risco-line',
  )
}

function normalizarTexto(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null
}

function normalizarNumero(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const numero = Number(value)
    return Number.isFinite(numero) ? numero : null
  }

  return null
}

function normalizarNivelRisco(value: unknown): NivelRisco | null {
  const texto = normalizarTexto(value)

  if (
    texto === 'Seguro' ||
    texto === 'Baixo' ||
    texto === 'Medio' ||
    texto === 'Alto' ||
    texto === 'Critico'
  ) {
    return texto
  }

  return null
}

function normalizarFeatureId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const numero = Number(value)
    return Number.isFinite(numero) ? numero : null
  }

  return null
}

function normalizarBairrosPoligonos(
  data: BairrosPoligonosGeoJson,
): BairrosPoligonosGeoJson {
  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      id: feature.properties.id,
    })),
  }
}

function normalizarRuasRisco(data: RuasRiscoGeoJson): RuasRiscoGeoJson {
  return {
    ...data,
    features: data.features.map((feature) => ({
      ...feature,
      id: feature.properties.id,
    })),
  }
}

function corDoRisco(nivel: string): string {
  const nivelNormalizado = normalizarNivelRisco(nivel)
  return nivelNormalizado ? RISCO_CORES[nivelNormalizado] : '#64748b'
}

function limparHoverBairro() {
  if (!map || hoveredBairroId === null) return

  map.setFeatureState(
    { source: 'bairros-poligonos', id: hoveredBairroId },
    { hover: false },
  )
  hoveredBairroId = null
}

function limparHoverRua() {
  if (!map || hoveredRuaId === null) return

  map.setFeatureState(
    { source: 'ruas-risco', id: hoveredRuaId },
    { hover: false },
  )
  hoveredRuaId = null
}

function extrairCrime(feature: mapboxgl.GeoJSONFeature): CrimeFeature | null {
  if (feature.geometry.type !== 'Point' || !feature.properties) {
    return null
  }

  const properties = feature.properties as Record<string, unknown>
  const coordinates = feature.geometry.coordinates

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [Number(coordinates[0]), Number(coordinates[1])],
    },
    properties: {
      natureza: normalizarTexto(properties.natureza) || '',
      categoria: normalizarTexto(properties.categoria) || '',
      dataFato: normalizarTexto(properties.dataFato) || '',
      horaFato: normalizarTexto(properties.horaFato),
      bairro: normalizarTexto(properties.bairro) || '',
      meioEmpregado: normalizarTexto(properties.meioEmpregado),
      sexoVitima: normalizarTexto(properties.sexoVitima),
      idadeVitima: normalizarNumero(properties.idadeVitima),
      precisaoCoordenada: normalizarPrecisaoCoordenada(
        properties.precisaoCoordenada,
      ),
    },
  }
}

function criarPopupHtml(properties: CrimeProperties): string {
  const precisao = normalizarPrecisaoCoordenada(properties.precisaoCoordenada)
  const corPrecisao = corPrecisaoCoordenada(precisao)

  return `
    <div style="color: #e2e8f0; padding: 4px;">
      <strong style="font-size: 14px;">${labelNatureza(properties.natureza)}</strong>
      <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">${properties.categoria}</p>
      <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">${properties.bairro}</p>
      <p style="margin: 4px 0; font-size: 11px; color: #64748b;">
        ${formatarDataCrime(properties.dataFato)}${properties.horaFato ? ` - ${properties.horaFato}` : ''}
      </p>
      <div style="margin-top: 8px;">
        <span style="display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; background: ${corPrecisao}26; border: 1px solid ${corPrecisao}4d; color: ${corPrecisao};">
          ${labelPrecisaoCoordenada(precisao)}
        </span>
      </div>
    </div>
  `
}

function criarPopupHtmlBairro(properties: Record<string, unknown>): string {
  const nomeDisplay =
    normalizarTexto(properties.nomeDisplay) ||
    normalizarTexto(properties.nome) ||
    'Bairro'
  const nivelRisco = normalizarNivelRisco(properties.nivelRisco)
  const totalCrimes = normalizarNumero(properties.totalCrimes) ?? 0
  const populacao = normalizarNumero(properties.populacao)
  const labelNivel = nivelRisco ? RISCO_LABELS[nivelRisco] : 'Indefinido'

  return `
    <div style="padding: 4px; color: #e2e8f0;">
      <strong style="font-size: 14px; display: block; margin-bottom: 4px;">${nomeDisplay}</strong>
      <div style="font-size: 12px; color: #94a3b8; display: flex; flex-direction: column; gap: 2px;">
        <span>Nivel: <strong style="color: ${corDoRisco(nivelRisco || labelNivel)};">${labelNivel}</strong></span>
        <span>Total de crimes: <strong style="color: #e2e8f0;">${totalCrimes.toLocaleString('pt-BR')}</strong></span>
        ${populacao !== null ? `<span>Populacao: <strong style="color: #e2e8f0;">${populacao.toLocaleString('pt-BR')}</strong></span>` : ''}
      </div>
    </div>
  `
}

function criarPopupHtmlRua(properties: Record<string, unknown>): string {
  const nome = normalizarTexto(properties.nome) || '(sem nome)'
  const bairro = normalizarTexto(properties.bairro)
  const tipo = normalizarTexto(properties.tipo) || '-'
  const nivelRisco = normalizarNivelRisco(properties.nivelRisco)
  const totalCrimes = normalizarNumero(properties.totalCrimes) ?? 0
  const labelNivel = nivelRisco ? RISCO_LABELS[nivelRisco] : 'Indefinido'
  const labelTipo = TIPOS_RUA_LABELS[tipo] || tipo

  return `
    <div style="padding: 10px; color: #0f172a; font-family: system-ui; max-width: 260px;">
      <strong style="font-size: 14px; display: block; margin-bottom: 2px;">${nome}</strong>
      ${bairro ? `<span style="font-size: 11px; color: #64748b;">${bairro}</span><br>` : ''}
      <div style="font-size: 12px; color: #475569; margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
        <span>Tipo: <strong>${labelTipo}</strong></span>
        <span>Nível: <strong style="color: ${corDoRisco(nivelRisco || labelNivel)};">${labelNivel}</strong></span>
        <span>Total de crimes: <strong>${totalCrimes.toLocaleString('pt-BR')}</strong></span>
      </div>
    </div>
  `
}

function setupEvents() {
  if (!map) return

  map.on('click', 'unclustered-point', (event) => {
    const feature = event.features?.[0]
    if (!feature) return

    const crime = extrairCrime(feature)
    if (!crime) return

    emit('crimeClick', crime)

    new mapboxgl.Popup({ className: 'crime-popup', maxWidth: '300px' })
      .setLngLat(crime.geometry.coordinates as [number, number])
      .setHTML(criarPopupHtml(crime.properties))
      .addTo(map!)
  })

  map.on('click', 'clusters', (event) => {
    const features = map!.queryRenderedFeatures(event.point, {
      layers: ['clusters'],
    })

    const feature = features[0]
    if (!feature) return

    const clusterId = feature.properties?.cluster_id
    if (typeof clusterId !== 'number') return

    const source = map!.getSource('crimes') as mapboxgl.GeoJSONSource

    source.getClusterExpansionZoom(clusterId, (error, zoom) => {
      if (error || !zoom || feature.geometry.type !== 'Point') return

      map!.easeTo({
        center: feature.geometry.coordinates as [number, number],
        zoom,
      })
    })
  })

  map.on('mouseenter', 'unclustered-point', () => {
    map!.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'unclustered-point', () => {
    map!.getCanvas().style.cursor = ''
  })
  map.on('mouseenter', 'clusters', () => {
    map!.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'clusters', () => {
    map!.getCanvas().style.cursor = ''
  })

  map.on('mousemove', 'bairros-fill', (event) => {
    const feature = event.features?.[0]
    if (!feature) return

    const featureId = normalizarFeatureId(feature.id)
    if (featureId === null) return

    if (hoveredBairroId !== null && hoveredBairroId !== featureId) {
      map!.setFeatureState(
        { source: 'bairros-poligonos', id: hoveredBairroId },
        { hover: false },
      )
    }

    hoveredBairroId = featureId
    map!.setFeatureState(
      { source: 'bairros-poligonos', id: hoveredBairroId },
      { hover: true },
    )
    map!.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'bairros-fill', () => {
    limparHoverBairro()
    map!.getCanvas().style.cursor = ''
  })

  map.on('click', 'bairros-fill', (event) => {
    const feature = event.features?.[0]
    if (!feature || !feature.properties) return

    new mapboxgl.Popup({ closeButton: true, maxWidth: '280px' })
      .setLngLat(event.lngLat)
      .setHTML(criarPopupHtmlBairro(feature.properties as Record<string, unknown>))
      .addTo(map!)
  })

  map.on('mousemove', 'ruas-risco-line', (event) => {
    const feature = event.features?.[0]
    if (!feature) return

    const featureId = normalizarFeatureId(feature.id)
    if (featureId === null) return

    if (hoveredRuaId !== null && hoveredRuaId !== featureId) {
      map!.setFeatureState(
        { source: 'ruas-risco', id: hoveredRuaId },
        { hover: false },
      )
    }

    hoveredRuaId = featureId
    map!.setFeatureState(
      { source: 'ruas-risco', id: hoveredRuaId },
      { hover: true },
    )
    map!.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', 'ruas-risco-line', () => {
    limparHoverRua()
    map!.getCanvas().style.cursor = ''
  })

  map.on('click', 'ruas-risco-line', (event) => {
    const feature = event.features?.[0]
    if (!feature || !feature.properties) return

    new mapboxgl.Popup({ closeButton: true, maxWidth: '280px' })
      .setLngLat(event.lngLat)
      .setHTML(criarPopupHtmlRua(feature.properties as Record<string, unknown>))
      .addTo(map!)
  })
}

function aplicarVisualizacao(modo: VisualizacaoMapa) {
  if (!map) return

  if (!map.isStyleLoaded()) {
    map.once('idle', () => {
      aplicarVisualizacao(props.visualizacao)
    })
    return
  }

  const ocorrenciasLayers = [
    'clusters',
    'cluster-count',
    'unclustered-point',
  ] as const
  const bairrosLayers = [
    'bairros-fill',
    'bairros-line',
    'bairros-labels',
  ] as const
  const ruasLayers = ['ruas-risco-halo', 'ruas-risco-line'] as const
  const todas = [...ocorrenciasLayers, ...bairrosLayers, ...ruasLayers]

  if (modo !== 'risco-bairros') {
    limparHoverBairro()
  }

  if (modo !== 'risco-ruas') {
    limparHoverRua()
  }

  map.getCanvas().style.cursor = ''

  todas.forEach((layerId) => {
    if (map!.getLayer(layerId)) {
      map!.setLayoutProperty(layerId, 'visibility', 'none')
    }
  })

  if (modo === 'ocorrencias') {
    ocorrenciasLayers.forEach((layerId) => {
      if (map!.getLayer(layerId)) {
        map!.setLayoutProperty(layerId, 'visibility', 'visible')
      }
    })
  } else if (modo === 'risco-bairros') {
    bairrosLayers.forEach((layerId) => {
      if (map!.getLayer(layerId)) {
        map!.setLayoutProperty(layerId, 'visibility', 'visible')
      }
    })
  } else if (modo === 'risco-ruas') {
    ruasLayers.forEach((layerId) => {
      if (map!.getLayer(layerId)) {
        map!.setLayoutProperty(layerId, 'visibility', 'visible')
      }
    })
  }
}

function irParaCoordenada(coords: { lng: number; lat: number; zoom: number }) {
  if (!map) return

  map.flyTo({
    center: [coords.lng, coords.lat],
    zoom: coords.zoom,
    duration: 1500,
  })

  if (searchMarker) {
    searchMarker.remove()
  }

  searchMarker = new mapboxgl.Marker({ color: '#3b82f6' })
    .setLngLat([coords.lng, coords.lat])
    .addTo(map)

  setTimeout(() => {
    searchMarker?.remove()
    searchMarker = null
  }, 10000)
}

defineExpose({ irParaCoordenada })

watch(
  () => props.geojson,
  (newData) => {
    if (!map) return

    const source = map.getSource('crimes') as mapboxgl.GeoJSONSource | undefined
    source?.setData(newData)
  },
  { deep: true },
)

watch(
  () => props.bairrosPoligonos,
  (newData) => {
    if (!map) return

    limparHoverBairro()

    const source = map.getSource('bairros-poligonos') as
      | mapboxgl.GeoJSONSource
      | undefined
    source?.setData(normalizarBairrosPoligonos(newData))
  },
  { deep: true },
)

watch(
  () => props.ruasRisco,
  (newData) => {
    if (!map) return

    limparHoverRua()

    const source = map.getSource('ruas-risco') as mapboxgl.GeoJSONSource | undefined
    source?.setData(normalizarRuasRisco(newData))
  },
  { deep: true },
)

watch(
  () => props.visualizacao,
  (modo) => {
    aplicarVisualizacao(modo)
  },
)

onMounted(() => initMap())
onUnmounted(() => {
  if (map) {
    limparHoverBairro()
    limparHoverRua()
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.mapa-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.mapa {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>

<style>
.mapboxgl-popup-content {
  background: #1e293b !important;
  border: 1px solid #334155 !important;
  border-radius: 8px !important;
  padding: 12px !important;
}

.mapboxgl-popup-tip {
  border-top-color: #1e293b !important;
}

.mapboxgl-popup-close-button {
  color: #94a3b8 !important;
  font-size: 18px !important;
}
</style>
