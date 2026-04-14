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
  formatarDataCrime,
  labelNatureza,
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
} from '../services/riscoService'

const TERRA_FIRME_CENTER: [number, number] = [-48.4513, -1.456]
const DEFAULT_ZOOM = 15

interface Props {
  geojson: CrimesGeoJson
  bairrosPoligonos: BairrosPoligonosGeoJson
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
    atualizarVisualizacao(props.visualizacao)
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
}

function addLayers() {
  if (!map) return

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
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.85,
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
    },
  }
}

function criarPopupHtml(properties: CrimeProperties): string {
  return `
    <div style="color: #e2e8f0; padding: 4px;">
      <strong style="font-size: 14px;">${labelNatureza(properties.natureza)}</strong>
      <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">${properties.categoria}</p>
      <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">${properties.bairro}</p>
      <p style="margin: 4px 0; font-size: 11px; color: #64748b;">
        ${formatarDataCrime(properties.dataFato)}${properties.horaFato ? ` - ${properties.horaFato}` : ''}
      </p>
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
        <span>Nivel: <strong style="color: ${corDoRisco(labelNivel)};">${labelNivel}</strong></span>
        <span>Total de crimes: <strong style="color: #e2e8f0;">${totalCrimes.toLocaleString('pt-BR')}</strong></span>
        ${populacao !== null ? `<span>Populacao: <strong style="color: #e2e8f0;">${populacao.toLocaleString('pt-BR')}</strong></span>` : ''}
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
}

function atualizarVisualizacao(modo: VisualizacaoMapa) {
  if (!map || !map.isStyleLoaded()) return

  const ocorrenciasLayers = [
    'clusters',
    'cluster-count',
    'unclustered-point',
  ] as const
  const riscoLayers = [
    'bairros-fill',
    'bairros-line',
    'bairros-labels',
  ] as const
  const todas = [...ocorrenciasLayers, ...riscoLayers]

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
    riscoLayers.forEach((layerId) => {
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
  () => props.visualizacao,
  (modo) => {
    atualizarVisualizacao(modo)
  },
)

onMounted(() => initMap())
onUnmounted(() => {
  if (map) {
    limparHoverBairro()
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
