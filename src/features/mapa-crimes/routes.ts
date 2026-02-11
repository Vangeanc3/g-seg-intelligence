import type { RouteRecordRaw } from 'vue-router'

export const mapaCrimesRoutes: RouteRecordRaw[] = [
  {
    path: 'mapa',
    name: 'mapa-crimes',
    component: () => import('./MapaCrimes.vue'),
    meta: {
      title: 'Mapa de Crimes',
      requiresAuth: true,
    },
  },
]
