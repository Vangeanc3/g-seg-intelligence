<template>
  <div class="main-layout">
    <!-- Botão hambúrguer mobile -->
    <button class="mobile-menu-btn" @click="mobileOpen = !mobileOpen">
      <i class="mdi mdi-menu"></i>
    </button>

    <!-- Overlay mobile -->
    <div
      v-if="mobileOpen"
      class="mobile-overlay"
      @click="mobileOpen = false"
    ></div>

    <!-- Sidebar -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileOpen"
      @toggle="toggleSidebar"
    />

    <!-- Área principal -->
    <div class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- Header -->
      <AppHeader @toggle-sidebar="toggleSidebar" />

      <!-- Conteúdo da página (aqui renderiza Dashboard, Mapa, etc) -->
      <main class="page-content">
        <AppBreadcrumbs />
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppHeader from './components/AppHeader.vue'
import AppBreadcrumbs from './components/AppBreadcrumbs.vue'

const sidebarCollapsed = ref(false)
const mobileOpen = ref(false)
const route = useRoute()

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// Fechar sidebar mobile ao navegar
watch(() => route.path, () => {
  mobileOpen.value = false
})
</script>

<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  background: #0f172a;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
  overflow: hidden;
}

.main-content.sidebar-collapsed {
  margin-left: 70px;
}

.page-content {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 101;
  width: 40px;
  height: 40px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 1.25rem;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.mobile-menu-btn:hover {
  background: #334155;
}

.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }

  .main-content {
    margin-left: 0 !important;
    padding-top: 3.5rem;
  }
}
</style>
