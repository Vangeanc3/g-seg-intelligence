<!-- src/layouts/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <!-- Esquerda: botão menu mobile + título da página -->
    <div class="header-left">
      <button class="menu-toggle-mobile" @click="$emit('toggle-sidebar')">
        <i class="mdi mdi-menu"></i>
      </button>

      <div class="page-title">
        <h1>{{ currentPageTitle }}</h1>
      </div>
    </div>

    <!-- Direita: notificações + perfil -->
    <div class="header-right">
      <!-- Notificações -->
      <NotificacoesDropdown />

      <!-- Menu do usuário -->
      <div class="user-menu-wrapper">
        <button class="user-button" @click="toggleUserMenu">
          <img
            :src="userAvatar"
            alt="Avatar"
            class="user-avatar"
          />
          <span class="user-name">{{ userName }}</span>
          <i class="mdi mdi-chevron-down"></i>
        </button>

        <!-- Dropdown usuário -->
        <transition name="dropdown">
          <div v-if="showUserMenu" class="user-dropdown">
            <div class="user-info">
              <img :src="userAvatar" alt="Avatar" />
              <div>
                <p class="user-name-full">{{ userName }}</p>
                <p class="user-email">{{ userEmail }}</p>
              </div>
            </div>

            <div class="menu-divider"></div>

            <router-link to="/app/perfil" class="dropdown-item">
              <i class="mdi mdi-account"></i>
              Meu Perfil
            </router-link>
            <router-link to="/app/configuracoes" class="dropdown-item">
              <i class="mdi mdi-cog"></i>
              Configurações
            </router-link>

            <div class="menu-divider"></div>

            <button class="dropdown-item logout-item" @click="mostrarLogout = true">
              <i class="mdi mdi-logout"></i>
              Sair
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>

  <LogoutModal
    :visivel="mostrarLogout"
    @cancelar="mostrarLogout = false"
    @confirmar="confirmarLogout"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/core/auth/authService'
import { useToast } from '@/shared/composables/useToast'
import LogoutModal from '@/shared/components/LogoutModal.vue'
import NotificacoesDropdown from '@/shared/components/NotificacoesDropdown.vue'

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const route = useRoute()
const router = useRouter()

const showUserMenu = ref(false)
const mostrarLogout = ref(false)

const toast = useToast()

// Usuário (depois virá do authService)
const userName = 'João Silva'
const userEmail = 'joao@gseg.com.br'
const userAvatar = 'https://ui-avatars.com/api/?name=Joao+Silva&background=3b82f6&color=fff'

const currentPageTitle = computed(() => {
  return (route.meta.title as string) || 'Dashboard'
})

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function confirmarLogout() {
  authService.logout()
  localStorage.removeItem('g-seg-perfil')
  mostrarLogout.value = false
  showUserMenu.value = false
  toast.info('Você saiu da plataforma.')
  router.push('/')
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 1.5rem;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle-mobile {
  display: none;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.page-title h1 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1.25rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu-wrapper {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.user-button:hover {
  background: rgba(59, 130, 246, 0.1);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
}

.user-name {
  color: #e2e8f0;
  font-size: 0.875rem;
  font-weight: 500;
}

.user-button i {
  color: #94a3b8;
  font-size: 1.25rem;
}

/* Dropdowns */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  z-index: 1000;
}

.user-info {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
}

.user-info img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #3b82f6;
}

.user-name-full {
  margin: 0;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-email {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
}

.menu-divider {
  height: 1px;
  background: #334155;
  margin: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.875rem;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.dropdown-item i {
  font-size: 1.25rem;
}

/* Animações */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile */
.logout-item {
  color: #ef4444 !important;
}

.logout-item:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #ef4444 !important;
}

@media (max-width: 768px) {
  .app-header {
    padding: 0 1rem;
  }

  .menu-toggle-mobile {
    display: block;
  }

  .user-name {
    display: none;
  }

  .page-title h1 {
    font-size: 1rem;
  }

  .user-dropdown {
    min-width: 280px;
    right: -0.5rem;
  }
}

@media (max-width: 480px) {
  .user-dropdown {
    position: fixed;
    left: 0.5rem;
    right: 0.5rem;
    min-width: auto;
  }
}
</style>
