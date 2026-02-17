<template>
  <nav v-if="items.length > 1" class="breadcrumbs">
    <template v-for="(item, i) in items" :key="item.path">
      <router-link
        v-if="i < items.length - 1"
        :to="item.path"
        class="breadcrumb-link"
      >
        {{ item.label }}
      </router-link>
      <span v-else class="breadcrumb-atual">{{ item.label }}</span>
      <i v-if="i < items.length - 1" class="mdi mdi-chevron-right breadcrumb-sep"></i>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path: string
}

const route = useRoute()

const labels: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/mapa': 'Mapa de Crimes',
  '/app/analytics': 'Analytics',
  '/app/relatorios': 'Relatórios',
  '/app/perfil': 'Meu Perfil',
}

const items = computed<BreadcrumbItem[]>(() => {
  const path = route.path
  const resultado: BreadcrumbItem[] = []

  resultado.push({ label: 'Início', path: '/app/dashboard' })

  if (path !== '/app/dashboard') {
    const label = labels[path] || (route.meta?.title as string) || 'Página'
    resultado.push({ label, path })
  }

  return resultado
})
</script>

<style scoped>
.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0;
  font-size: 0.8125rem;
  margin-bottom: 0.75rem;
}

.breadcrumb-link {
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #3b82f6;
}

.breadcrumb-sep {
  color: #475569;
  font-size: 0.875rem;
}

.breadcrumb-atual {
  color: #e2e8f0;
  font-weight: 500;
}

@media (max-width: 768px) {
  .breadcrumbs {
    font-size: 0.75rem;
  }
}
</style>
