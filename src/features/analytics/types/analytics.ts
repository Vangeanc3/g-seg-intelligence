export interface AnalyticsCard {
  titulo: string
  valor: string | number
  subtitulo?: string
  variacao?: number     // percentual vs período anterior (positivo = aumento)
  icone: string         // classe MDI
  cor: string           // cor do ícone/accent
}

export interface AnalyticsFiltros {
  periodo: '7d' | '30d' | '90d' | 'all'
  dataInicio: string
  dataFim: string
}
