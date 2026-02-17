<template>
  <div class="mapa-container">
    <div ref="mapContainer" class="mapa"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { CRIME_CORES } from '../types/crime'
import { createMask } from '../utils/maskHelper'

interface Props {
  geojson: unknown
  visualizacao: 'pontos' | 'heatmap' | 'clusters'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  crimeClick: [properties: Record<string, unknown>]
}>()

const mapContainer = ref<HTMLDivElement>()
let map: mapboxgl.Map | null = null
let searchMarker: mapboxgl.Marker | null = null

function initMap() {
  if (!mapContainer.value) return

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-48.4902, -1.4558],
    zoom: 13,
    minZoom: 10,
    maxZoom: 18,
    maxBounds: [
      [-48.65, -1.55],  // Sudoeste (cobre Belém + margem)
      [-48.30, -1.10],  // Nordeste (cobre ilhas de Belém)
    ],
  })

  map.addControl(new mapboxgl.NavigationControl(), 'top-right')
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')

  map.on('load', async () => {
    await addBelemBoundary()
    addSource()
    addLayers()
    setupClickEvents()
  })
}

async function addBelemBoundary() {
  if (!map) return

  try {
    const response = await fetch('/data/belem_boundary.geojson')
    const belemData: GeoJSON.FeatureCollection = await response.json()
    const mask = createMask(belemData)

    // Source e Layer: Máscara (escurece fora de Belém)
    map.addSource('belem-mask', {
      type: 'geojson',
      data: mask
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

    // Source e Layer: Contorno de Belém (borda azul)
    map.addSource('belem-boundary', {
      type: 'geojson',
      data: belemData
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
    console.error('Erro ao carregar boundary de Belém:', error)
  }
}

function addSource() {
  if (!map) return

  map.addSource('crimes', {
    type: 'geojson',
    data: props.geojson as mapboxgl.GeoJSONSourceSpecification['data'],
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  })
}

function addLayers() {
  if (!map) return

  // Layer: Pontos individuais (não clusterizados)
  map.addLayer({
    id: 'crime-points',
    type: 'circle',
    source: 'crimes',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 6,
      'circle-color': [
        'match',
        ['get', 'tipo'],
        'roubo', CRIME_CORES.roubo,
        'furto', CRIME_CORES.furto,
        'homicidio', CRIME_CORES.homicidio,
        'trafico', CRIME_CORES.trafico,
        'agressao', CRIME_CORES.agressao,
        CRIME_CORES.outro,
      ],
      'circle-stroke-width': 1,
      'circle-stroke-color': '#ffffff',
      'circle-opacity': 0.85,
    },
  })

  // Layer: Clusters
  map.addLayer({
    id: 'crime-clusters',
    type: 'circle',
    source: 'crimes',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': [
        'step',
        ['get', 'point_count'],
        '#3b82f6',
        10, '#f59e0b',
        50, '#ef4444',
      ],
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        20,
        10, 30,
        50, 40,
      ],
      'circle-opacity': 0.75,
    },
  })

  // Layer: Texto do cluster (número)
  map.addLayer({
    id: 'crime-cluster-count',
    type: 'symbol',
    source: 'crimes',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#ffffff',
    },
  })

  // Layer: Heatmap (começa invisível)
  map.addLayer({
    id: 'crime-heat',
    type: 'heatmap',
    source: 'crimes',
    paint: {
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 18, 3],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 15, 18, 30],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,255,0)',
        0.2, 'rgb(0,255,128)',
        0.4, 'rgb(255,255,0)',
        0.6, 'rgb(255,165,0)',
        1, 'rgb(255,0,0)',
      ],
      'heatmap-opacity': 0.7,
    },
    layout: {
      visibility: 'none',
    },
  })
}

function setupClickEvents() {
  if (!map) return

  // Click no ponto individual
  map.on('click', 'crime-points', (e) => {
    if (e.features && e.features[0]) {
      const properties = e.features[0].properties
      if (properties) {
        emit('crimeClick', properties as Record<string, unknown>)

        const coords = (e.features[0].geometry as GeoJSON.Point).coordinates as [number, number]
        new mapboxgl.Popup({ className: 'crime-popup', maxWidth: '300px' })
          .setLngLat(coords)
          .setHTML(`
            <div style="color: #e2e8f0; padding: 4px;">
              <strong style="font-size: 14px; text-transform: capitalize;">${properties.tipo}</strong>
              <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">${properties.endereco}</p>
              <p style="margin: 4px 0; font-size: 12px; color: #94a3b8;">${properties.bairro}</p>
              <p style="margin: 4px 0; font-size: 11px; color: #64748b;">${new Date(properties.data as string).toLocaleDateString('pt-BR')}</p>
              <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: ${
                properties.status === 'solucionado' ? '#22c55e20' : properties.status === 'em_investigacao' ? '#f59e0b20' : '#ef444420'
              }; color: ${
                properties.status === 'solucionado' ? '#22c55e' : properties.status === 'em_investigacao' ? '#f59e0b' : '#ef4444'
              };">${String(properties.status).replace('_', ' ')}</span>
            </div>
          `)
          .addTo(map!)
      }
    }
  })

  // Click no cluster → zoom
  map.on('click', 'crime-clusters', (e) => {
    const features = map!.queryRenderedFeatures(e.point, { layers: ['crime-clusters'] })
    if (!features.length || !features[0]) return
    const clusterId = features[0].properties?.cluster_id
    const source = map!.getSource('crimes') as mapboxgl.GeoJSONSource
    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err || !zoom || !features[0]?.geometry) return
      map!.easeTo({
        center: (features[0].geometry as GeoJSON.Point).coordinates as [number, number],
        zoom,
      })
    })
  })

  // Cursor pointer ao passar nos pontos/clusters
  map.on('mouseenter', 'crime-points', () => { map!.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'crime-points', () => { map!.getCanvas().style.cursor = '' })
  map.on('mouseenter', 'crime-clusters', () => { map!.getCanvas().style.cursor = 'pointer' })
  map.on('mouseleave', 'crime-clusters', () => { map!.getCanvas().style.cursor = '' })
}

function atualizarVisualizacao(modo: string) {
  if (!map || !map.isStyleLoaded()) return

  const pontos = modo === 'pontos' || modo === 'clusters'
  const heat = modo === 'heatmap'

  map.setLayoutProperty('crime-points', 'visibility', pontos ? 'visible' : 'none')
  map.setLayoutProperty('crime-clusters', 'visibility', modo === 'clusters' ? 'visible' : 'none')
  map.setLayoutProperty('crime-cluster-count', 'visibility', modo === 'clusters' ? 'visible' : 'none')
  map.setLayoutProperty('crime-heat', 'visibility', heat ? 'visible' : 'none')
}

function irParaCoordenada(coords: { lng: number; lat: number; zoom: number }) {
  if (!map) return

  // Voar até o ponto
  map.flyTo({
    center: [coords.lng, coords.lat],
    zoom: coords.zoom,
    duration: 1500,
  })

  // Remover marker anterior
  if (searchMarker) {
    searchMarker.remove()
  }

  // Criar novo marker
  searchMarker = new mapboxgl.Marker({ color: '#3b82f6' })
    .setLngLat([coords.lng, coords.lat])
    .addTo(map)

  // Remover marker após 10s
  setTimeout(() => {
    searchMarker?.remove()
    searchMarker = null
  }, 10000)
}

// Expor método para componente pai
defineExpose({ irParaCoordenada })

// Watchers
watch(() => props.geojson, (newData) => {
  if (!map) return
  const source = map.getSource('crimes') as mapboxgl.GeoJSONSource
  if (source) {
    source.setData(newData as GeoJSON.FeatureCollection)
  }
}, { deep: true })

watch(() => props.visualizacao, (modo) => {
  atualizarVisualizacao(modo)
})

onMounted(() => initMap())
onUnmounted(() => {
  if (map) {
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
