import {
  analyticsService,
  type AnalyticsResponse,
} from '@/features/analytics/services/analyticsService'

export interface ComparativoBairro {
  nome: string
  dados: AnalyticsResponse | null
  carregando: boolean
  erro: string | null
}

export const comparativoService = {
  async getAnalyticsBairro(bairro: string): Promise<AnalyticsResponse> {
    return analyticsService.get({ bairro })
  },
}
