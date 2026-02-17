export interface Usuario {
  nome: string
  email: string
  telefone: string
  empresa: string
  cargo: string
  plano: 'basico' | 'profissional' | 'enterprise'
  criadoEm: string
  avatar?: string // URL ou null (usa iniciais)
}
