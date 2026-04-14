import { http } from '@/shared/services/http'

const TOKEN_STORAGE_KEY = 'g-seg-token'
const PROFILE_STORAGE_KEY = 'g-seg-perfil'
const LEGACY_STORAGE_KEYS = ['auth_token', 'user_data', 'refresh_token'] as const

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(PROFILE_STORAGE_KEY)

  for (const key of LEGACY_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>('/auth/login', credentials)
    return data
  },

  logout() {
    clearAuthStorage()
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
