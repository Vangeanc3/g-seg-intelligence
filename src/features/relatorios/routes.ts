import type { RouteRecordRaw } from 'vue-router'

export const relatoriosRoutes: RouteRecordRaw[] = [
  {
    path: 'relatorios',
    name: 'relatorios',
    component: () => import('./Relatorios.vue'),
    meta: {
      title: 'Relatórios',
      requiresAuth: true,
    },
  },
]
