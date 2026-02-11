import type { RouteRecordRaw } from 'vue-router'

export const analyticsRoutes: RouteRecordRaw[] = [
  {
    path: 'analytics',
    name: 'analytics',
    component: () => import('./Analytics.vue'),
    meta: {
      title: 'Analytics',
      requiresAuth: true,
    },
  },
]
