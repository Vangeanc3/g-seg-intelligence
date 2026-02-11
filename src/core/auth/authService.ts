// src/core/auth/authService.ts
import { http } from '../api/http'
import { AUTH_CONFIG } from '../config/constants'

export interface LoginCredentials {
  email: string
  senha: string
}

export interface RegisterData {
  nome: string
  email: string
  senha: string
  empresa?: string
}

export interface User {
  id: string
  nome: string
  email: string
  role: 'admin' | 'user' | 'enterprise'
  empresa?: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/login', credentials)

    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.token)
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.data.refreshToken)
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(response.data.user))

    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/register', data)

    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.token)
    localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, response.data.refreshToken)
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(response.data.user))

    return response.data
  },

  logout(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY)
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)
    localStorage.removeItem(AUTH_CONFIG.USER_KEY)
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_CONFIG.TOKEN_KEY)
  },

  getCurrentUser(): User | null {
    const userData = localStorage.getItem(AUTH_CONFIG.USER_KEY)
    return userData ? JSON.parse(userData) : null
  },

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY)

    if (!refreshToken) {
      throw new Error('No refresh token')
    }

    const response = await http.post<{ token: string }>('/auth/refresh', {
      refreshToken,
    })

    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, response.data.token)
    return response.data.token
  },
}
