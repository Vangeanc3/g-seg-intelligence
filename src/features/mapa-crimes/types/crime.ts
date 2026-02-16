export type TipoCrime = 'roubo' | 'furto' | 'homicidio' | 'trafico' | 'agressao' | 'outro'
export type StatusCrime = 'aberto' | 'em_investigacao' | 'solucionado'

export interface Crime {
  id: string
  tipo: TipoCrime
  descricao: string
  data: string
  lat: number
  lng: number
  endereco: string
  bairro: string
  status: StatusCrime
}

export interface FiltrosCrime {
  tipos: TipoCrime[]
  dataInicio: string
  dataFim: string
  bairros: string[]
}

export const CRIME_CORES: Record<TipoCrime, string> = {
  roubo: '#ef4444',
  furto: '#f59e0b',
  homicidio: '#dc2626',
  trafico: '#8b5cf6',
  agressao: '#ec4899',
  outro: '#6b7280'
}

export const CRIME_LABELS: Record<TipoCrime, string> = {
  roubo: 'Roubo',
  furto: 'Furto',
  homicidio: 'Homicídio',
  trafico: 'Tráfico',
  agressao: 'Agressão',
  outro: 'Outro'
}