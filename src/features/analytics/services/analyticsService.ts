import { http } from '@/shared/services/http'

export interface AnalyticsFiltros {
  dataInicio?: string
  dataFim?: string
  bairro?: string
}

export interface LabelTotal {
  label: string
  total: number
}

export interface PrecisaoResumo {
  alta: number
  media: number
  baixa: number
  percentualPreciso: number
}

export interface RuaRankingItem {
  ruaId: number
  nome: string
  tipo: string
  totalCrimes: number
  nivelRisco: string
  naturezaPredominante: string | null
}

export interface AnalyticsResponse {
  totalCrimes: number
  porNatureza: LabelTotal[]
  porDiaSemana: LabelTotal[]
  porFaixaHoraria: LabelTotal[]
  porMes: LabelTotal[]
  topCategorias: LabelTotal[]
  precisao: PrecisaoResumo
}

export const analyticsService = {
  async get(filtros: AnalyticsFiltros = {}): Promise<AnalyticsResponse> {
    const { data } = await http.get<AnalyticsResponse>('/analytics', {
      params: filtros,
    })

    return data
  },

  async getTopRuas(
    filtros: AnalyticsFiltros & { limite?: number } = {},
  ): Promise<RuaRankingItem[]> {
    const { data } = await http.get<RuaRankingItem[]>('/analytics/top-ruas', {
      params: filtros,
    })

    return data
  },
}
