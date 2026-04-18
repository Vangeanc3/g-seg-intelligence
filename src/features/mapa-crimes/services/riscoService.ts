import { http } from '@/shared/services/http'
import type {
  FeatureCollection,
  LineString,
  MultiLineString,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson'

export type NivelRisco = 'Seguro' | 'Baixo' | 'Medio' | 'Alto' | 'Critico'

export interface RiscoBairroProperties {
  nome: string
  nivelRisco: NivelRisco
  totalCrimes: number
}

export type RiscoBairrosGeoJson = FeatureCollection<Point, RiscoBairroProperties>

export interface BairroPoligonoProperties {
  id: number
  nome: string
  nomeDisplay: string
  populacao: number | null
  totalCrimes: number
  nivelRisco: NivelRisco
}

export type BairrosPoligonosGeoJson = FeatureCollection<
  Polygon | MultiPolygon,
  BairroPoligonoProperties
>

export interface RuaRiscoProperties {
  id: number
  nome: string
  tipo: string
  totalCrimes: number
  nivelRisco: NivelRisco
  bairro?: string
}

export type RuasRiscoGeoJson = FeatureCollection<
  LineString | MultiLineString,
  RuaRiscoProperties
>

export interface RiscoFiltros {
  dataInicio?: string
  dataFim?: string
  natureza?: string
}

export const riscoService = {
  async getRiscoBairros(filtros: RiscoFiltros = {}): Promise<RiscoBairrosGeoJson> {
    const { data } = await http.get<RiscoBairrosGeoJson>('/mapa/risco-bairros', { params: filtros })
    return data
  },

  async getBairrosPoligonos(
    filtros: RiscoFiltros = {},
  ): Promise<BairrosPoligonosGeoJson> {
    const { data } = await http.get<BairrosPoligonosGeoJson>(
      '/mapa/bairros-poligonos',
      { params: filtros },
    )
    return data
  },

  async getRuasRisco(filtros: RiscoFiltros = {}): Promise<RuasRiscoGeoJson> {
    const { data } = await http.get<RuasRiscoGeoJson>('/mapa/ruas-risco', {
      params: filtros,
    })
    return data
  },
}

export const RISCO_CORES: Record<NivelRisco, string> = {
  Seguro: '#22c55e',
  Baixo: '#84cc16',
  Medio: '#f59e0b',
  Alto: '#f97316',
  Critico: '#ef4444',
}

export const RISCO_LABELS: Record<NivelRisco, string> = {
  Seguro: 'Seguro',
  Baixo: 'Baixo',
  Medio: 'Médio',
  Alto: 'Alto',
  Critico: 'Crítico',
}
