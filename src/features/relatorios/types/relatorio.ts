export interface RelatorioConfig {
  titulo: string
  dataInicio: string
  dataFim: string
  bairros: string[]
  naturezas: string[]
}

export interface RelatorioEstatisticas {
  total: number
  mediaDiaria: number
  bairroMaisPerigoso: string
  tipoMaisFrequente: string
  horarioPico: string
  periodoDias: number
  topBairros: { bairro: string; qtd: number }[]
  topNaturezas: { natureza: string; label: string; qtd: number; pct: number; cor: string }[]
}
