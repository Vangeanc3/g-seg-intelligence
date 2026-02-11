export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: ApiError[]
}

export interface ApiError {
  field?: string
  message: string
  code?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export interface Coordinates {
  lat: number
  lng: number
}

/**
 * Área geográfica (bounds do mapa)
 */
export interface GeoBounds {
  norte: number
  sul: number
  leste: number
  oeste: number
}

export interface DateFilter {
  inicio?: Date | string
  fim?: Date | string
}

export interface LoadingState {
  loading: boolean
  error: string | null
}

/**
 * Variáveis de ambiente do Vite
 */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_MAPBOX_TOKEN?: string
  readonly VITE_ENVIRONMENT: 'development' | 'staging' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
