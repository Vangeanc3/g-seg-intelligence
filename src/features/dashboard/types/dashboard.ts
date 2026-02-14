export interface DashboardStats {
  totalCrimes: number
  solvedCases: number
  investigating: number
  resolutionRate: number
  changePercent: {
    totalCrimes: number
    solvedCases: number
    investigating: number
    resolutionRate: number
  }
}

export interface CrimeByDate {
  date: string
  count: number
}

export interface CrimeByType {
  type: string
  count: number
  percentage: number
  color: string
}

export interface RecentCrime {
  id: string
  type: string
  date: string
  location: string
  status: 'aberto' | 'em_investigacao' | 'solucionado'
  priority: 'baixa' | 'media' | 'alta'
}

export type DateFilterOption = '7d' | '30d' | '90d' | 'custom'
