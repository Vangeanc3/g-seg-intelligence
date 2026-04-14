import type { Feature, FeatureCollection, Point } from 'geojson'

export const CRIME_LABELS: Record<string, string> = {
  FURTO: 'Furto',
  ROUBO: 'Roubo',
  'LESAO CORPORAL': 'Lesao Corporal',
  'TRAFICO DE DROGAS': 'Trafico de Drogas',
  'ESTUPRO DE VULNERAVEL': 'Estupro de Vulneravel',
  HOMICIDIO: 'Homicidio',
  'MORTE NO TRANSITO': 'Morte no Transito',
  ESTUPRO: 'Estupro',
}

export const CRIME_CORES: Record<string, string> = {
  FURTO: '#f59e0b',
  ROUBO: '#ef4444',
  'LESAO CORPORAL': '#f97316',
  'TRAFICO DE DROGAS': '#8b5cf6',
  'ESTUPRO DE VULNERAVEL': '#dc2626',
  HOMICIDIO: '#991b1b',
  'MORTE NO TRANSITO': '#06b6d4',
  ESTUPRO: '#be123c',
}

export interface CrimeProperties {
  natureza: string
  categoria: string
  dataFato: string
  horaFato: string | null
  bairro: string
  meioEmpregado: string | null
  sexoVitima: string | null
  idadeVitima: number | null
}

export type CrimeFeature = Feature<Point, CrimeProperties>
export type CrimesGeoJson = FeatureCollection<Point, CrimeProperties>

export interface FiltrosCrime {
  natureza: string
  bairro: string
  dataInicio: string
  dataFim: string
}

export type VisualizacaoMapa = 'ocorrencias' | 'risco-bairros'

export function criarGeoJsonVazio(): CrimesGeoJson {
  return {
    type: 'FeatureCollection',
    features: [],
  }
}

export function labelNatureza(natureza: string): string {
  return CRIME_LABELS[natureza] ?? natureza
}

export function corNatureza(natureza: string): string {
  return CRIME_CORES[natureza] ?? '#6b7280'
}

export function formatarDataCrime(data: string): string {
  const dataFormatada = new Date(data)

  if (Number.isNaN(dataFormatada.getTime())) {
    return data
  }

  return dataFormatada.toLocaleDateString('pt-BR')
}

export function formatarHoraCrime(hora: string | null): string {
  return hora || '--'
}

export function formatarVitima(
  sexoVitima: string | null,
  idadeVitima: number | null,
): string {
  if (!sexoVitima) {
    return '--'
  }

  const sexo =
    sexoVitima === 'M'
      ? 'Masculino'
      : sexoVitima === 'F'
        ? 'Feminino'
        : sexoVitima

  return idadeVitima ? `${sexo} - ${idadeVitima} anos` : sexo
}

export function chaveCrime(crime: CrimeFeature): string {
  const [lng, lat] = crime.geometry.coordinates

  return [
    crime.properties.natureza,
    crime.properties.categoria,
    crime.properties.dataFato,
    crime.properties.horaFato || '',
    crime.properties.bairro,
    lng,
    lat,
  ].join('|')
}
