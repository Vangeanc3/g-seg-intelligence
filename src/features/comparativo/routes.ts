import type { RouteRecordRaw } from 'vue-router'

export const comparativoRoutes: RouteRecordRaw[] = [
  {
    path: 'comparativo',
    name: 'comparativo-bairros',
    component: () => import('./ComparativoPage.vue'),
    meta: {
      title: 'Comparativo',
      requiresAuth: true,
    },
  },
]
