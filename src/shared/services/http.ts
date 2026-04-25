import axios, { AxiosError } from 'axios'

const TOKEN_STORAGE_KEY = 'g-seg-token'
const USER_STORAGE_KEY = 'g-seg-user'
const PROFILE_STORAGE_KEY = 'g-seg-perfil'
const LEGACY_STORAGE_KEYS = ['auth_token', 'user_data', 'refresh_token'] as const

function clearAuthStorage() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USER_STORAGE_KEY)
  localStorage.removeItem(PROFILE_STORAGE_KEY)

  for (const key of LEGACY_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const hadToken = !!localStorage.getItem(TOKEN_STORAGE_KEY)

      clearAuthStorage()

      if (hadToken && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  },
)
