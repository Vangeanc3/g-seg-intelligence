import type { TipoCrime } from '@/features/mapa-crimes/types/crime'

export interface RelatorioConfig {
  titulo: string
  periodo: {
    inicio: string
    fim: string
  }
  bairros: string[]         // vazio = todos
  tipos: TipoCrime[]        // vazio = todos
}

export interface RelatorioResumo {
  totalCrimes: number
  periodoDias: number
  mediaDiaria: number
  bairroMaisPerigoso: string
  tipoMaisFrequente: string
  horarioPico: string
  porTipo: { tipo: string; label: string; total: number; cor: string; percentual: number }[]
  porBairro: { bairro: string; total: number; percentual: number }[]
  porStatus: { status: string; label: string; total: number; cor: string }[]
}
