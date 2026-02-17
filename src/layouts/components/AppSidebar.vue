<template>
  <aside class="app-sidebar" :class="{ collapsed, 'mobile-open': mobileOpen }">
    <!-- Logo e título -->
    <div class="sidebar-header">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6"/>
          <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="#60a5fa"/>
        </svg>
      </div>
      <transition name="fade">
        <span v-if="!collapsed" class="app-title">G-SEG Analytics</span>
      </transition>
    </div>

    <!-- Menu de navegação -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :data-tooltip="item.label"
      >
        <i :class="item.icon" class="nav-icon"></i>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
        </transition>
      </router-link>
    </nav>

    <!-- Botão recolher -->
    <div class="sidebar-footer">
      <button class="nav-item" @click="$emit('toggle')" :data-tooltip="collapsed ? 'Expandir' : ''">
        <i :class="collapsed ? 'mdi mdi-menu-open' : 'mdi mdi-menu'" class="nav-icon"></i>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-text">Recolher</span>
        </transition>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface Props {
  collapsed: boolean
  mobileOpen?: boolean
}

defineProps<Props>()
defineEmits<{
  (e: 'toggle'): void
}>()

const route = useRoute()

// Itens do menu
const menuItems = [
  { path: '/app/dashboard', label: 'Dashboard', icon: 'mdi mdi-view-dashboard' },
  { path: '/app/mapa', label: 'Mapa de Crimes', icon: 'mdi mdi-map-marker' },
  { path: '/app/analytics', label: 'Analytics', icon: 'mdi mdi-chart-line' },
  { path: '/app/relatorios', label: 'Relatórios', icon: 'mdi mdi-file-document' },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background: #1e293b;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  z-index: 100;
  border-right: 1px solid #334155;
}

.app-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #334155;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
}

.app-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0.75rem 1rem;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  font-size: 0.875rem;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border-left: 3px solid #3b82f6;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-footer {
  padding: 1rem 0;
  border-top: 1px solid #334155;
}

/* Animações */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tooltip — só quando sidebar colapsada */
.app-sidebar.collapsed .nav-item {
  position: relative;
}

.app-sidebar.collapsed .nav-item::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%) translateX(-4px);
  padding: 0.375rem 0.75rem;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 200;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.app-sidebar.collapsed .nav-item:hover::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease, width 0.3s ease;
    box-shadow: none;
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
    width: 250px !important;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
  }

  .app-sidebar.collapsed {
    transform: translateX(-100%);
  }
}
</style>
