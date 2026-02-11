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
      <div class="notification-wrapper">
        <button class="icon-button" @click="toggleNotifications">
          <i class="mdi mdi-bell"></i>
          <span v-if="unreadCount > 0" class="notification-badge">
            {{ unreadCount }}
          </span>
        </button>

        <!-- Dropdown notificações -->
        <transition name="dropdown">
          <div v-if="showNotifications" class="notifications-dropdown">
            <div class="dropdown-header">
              <h3>Notificações</h3>
              <button @click="markAllAsRead">Marcar todas como lidas</button>
            </div>

            <div class="notifications-list">
              <div
                v-for="notif in notifications"
                :key="notif.id"
                class="notification-item"
                :class="{ unread: !notif.read }"
              >
                <i :class="notif.icon" class="notif-icon"></i>
                <div class="notif-content">
                  <p class="notif-title">{{ notif.title }}</p>
                  <p class="notif-time">{{ notif.time }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

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

            <router-link to="/perfil" class="dropdown-item">
              <i class="mdi mdi-account"></i>
              Meu Perfil
            </router-link>
            <router-link to="/configuracoes" class="dropdown-item">
              <i class="mdi mdi-cog"></i>
              Configurações
            </router-link>

            <div class="menu-divider"></div>

            <button class="dropdown-item" @click="handleLogout">
              <i class="mdi mdi-logout"></i>
              Sair
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/core/auth/authService'

defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const route = useRoute()
const router = useRouter()

const showNotifications = ref(false)
const showUserMenu = ref(false)

// Usuário (depois virá do authService)
const userName = 'João Silva'
const userEmail = 'joao@gseg.com.br'
const userAvatar = 'https://ui-avatars.com/api/?name=Joao+Silva&background=3b82f6&color=fff'

// Notificações (mock - depois virá de API)
const notifications = ref([
  {
    id: 1,
    title: 'Nova ocorrência no Umarizal',
    time: 'Há 5 minutos',
    icon: 'mdi mdi-alert-circle',
    read: false
  },
  {
    id: 2,
    title: 'Relatório mensal disponível',
    time: 'Há 1 hora',
    icon: 'mdi mdi-file-document',
    read: false
  },
  {
    id: 3,
    title: 'Atualização do sistema',
    time: 'Há 3 horas',
    icon: 'mdi mdi-update',
    read: true
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const currentPageTitle = computed(() => {
  return (route.meta.title as string) || 'Dashboard'
})

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

function markAllAsRead() {
  notifications.value.forEach(n => n.read = true)
}

function handleLogout() {
  authService.logout()
  router.push('/auth/login')
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

.icon-button {
  position: relative;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.icon-button:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.notification-wrapper,
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
.notifications-dropdown,
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

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #334155;
}

.dropdown-header h3 {
  margin: 0;
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
}

.dropdown-header button {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 0.75rem;
  cursor: pointer;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #334155;
  transition: background 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  background: rgba(59, 130, 246, 0.05);
}

.notification-item.unread {
  background: rgba(59, 130, 246, 0.08);
}

.notif-icon {
  font-size: 1.5rem;
  color: #60a5fa;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
}

.notif-title {
  margin: 0;
  color: #e2e8f0;
  font-size: 0.875rem;
}

.notif-time {
  margin: 0.25rem 0 0;
  color: #64748b;
  font-size: 0.75rem;
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
@media (max-width: 768px) {
  .menu-toggle-mobile {
    display: block;
  }

  .user-name {
    display: none;
  }
}
</style>
