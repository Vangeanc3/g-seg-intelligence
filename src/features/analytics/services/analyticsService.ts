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

export interface AnalyticsResponse {
  totalCrimes: number
  porNatureza: LabelTotal[]
  porDiaSemana: LabelTotal[]
  porFaixaHoraria: LabelTotal[]
  porMes: LabelTotal[]
  topCategorias: LabelTotal[]
}

export const analyticsService = {
  async get(filtros: AnalyticsFiltros = {}): Promise<AnalyticsResponse> {
    const { data } = await http.get<AnalyticsResponse>('/analytics', {
      params: filtros,
    })

    return data
  },
}
