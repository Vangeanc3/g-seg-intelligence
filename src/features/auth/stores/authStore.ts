import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  authService,
  type AuthUser,
  type LoginRequest,
  type LoginResponse,
} from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(authService.getToken())
  const user = ref<AuthUser | null>(authService.getUser())

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')

  async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const session = await authService.login(credentials)
    authService.setSession(session)
    token.value = session.token
    user.value = session.usuario
    return session
  }

  function syncFromStorage() {
    token.value = authService.getToken()
    user.value = authService.getUser()
  }

  function logout() {
    authService.logout()
    token.value = null
    user.value = null
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    syncFromStorage,
  }
})
