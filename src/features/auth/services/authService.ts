import { http } from '@/shared/services/http'

const TOKEN_STORAGE_KEY = 'g-seg-token'
const USER_STORAGE_KEY = 'g-seg-user'
const PROFILE_STORAGE_KEY = 'g-seg-perfil'
const LEGACY_STORAGE_KEYS = ['auth_token', 'user_data', 'refresh_token'] as const

export interface LoginRequest {
  email: string
  password: string
}

export type AuthRole = 'Admin' | 'Usuario'

export interface AuthUser {
  nome: string
  email: string
  role: AuthRole
}

export interface LoginResponse {
  token: string
  usuario: AuthUser
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') return false

  const user = value as Partial<AuthUser>

  return (
    typeof user.nome === 'string' &&
    typeof user.email === 'string' &&
    (user.role === 'Admin' || user.role === 'Usuario')
  )
}

function parseStoredUser(rawUser: string | null): AuthUser | null {
  if (!rawUser) return null

  try {
    const parsedUser = JSON.parse(rawUser) as unknown
    return isAuthUser(parsedUser) ? parsedUser : null
  } catch {
    return null
  }
}

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
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

  setSession(session: LoginResponse) {
    localStorage.setItem(TOKEN_STORAGE_KEY, session.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session.usuario))
  },

  logout() {
    clearAuthStorage()
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  },

  getUser(): AuthUser | null {
    return parseStoredUser(localStorage.getItem(USER_STORAGE_KEY))
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
