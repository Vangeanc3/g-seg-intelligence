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

export type DateFilterOption = '7d' | '30d' | '90d'
