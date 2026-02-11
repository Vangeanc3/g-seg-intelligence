<template>
  <aside class="app-sidebar" :class="{ collapsed }">
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
      >
        <i :class="item.icon" class="nav-icon"></i>
        <transition name="fade">
          <span v-if="!collapsed" class="nav-text">{{ item.label }}</span>
        </transition>
      </router-link>
    </nav>

    <!-- Botão recolher -->
    <div class="sidebar-footer">
      <button class="nav-item" @click="$emit('toggle')">
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
}

defineProps<Props>()
defineEmits<{
  (e: 'toggle'): void
}>()

const route = useRoute()

// Itens do menu baseado na imagem
const menuItems = [
  { path: '/dashboard', label: 'Home', icon: 'mdi mdi-home' },
  { path: '/analytics', label: 'Analytics', icon: 'mdi mdi-chart-line' },
  { path: '/mapa', label: 'Mapeamento Criminal', icon: 'mdi mdi-map-marker' },
  { path: '/mapa-tipo', label: 'Mapeamento a Tipo', icon: 'mdi mdi-filter-variant' },
  { path: '/mapa-risco', label: 'Mapeamento a Risco', icon: 'mdi mdi-shield-alert' },
  { path: '/potenciacao', label: 'Potenciação', icon: 'mdi mdi-trending-up' },
  { path: '/monitores', label: 'Monitores', icon: 'mdi mdi-monitor-dashboard' },
  { path: '/relatorios', label: 'Unidocs', icon: 'mdi mdi-file-document' },
  { path: '/seguimento', label: 'Seguimento', icon: 'mdi mdi-target' }
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
</style>
