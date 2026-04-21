import { createRouter, createWebHistory } from 'vue-router'

import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Rotas por feature
import { dashboardRoutes } from '@/features/dashboard/routes'
import { mapaCrimesRoutes } from '@/features/mapa-crimes/routes'
import { analyticsRoutes } from '@/features/analytics/routes'
import { comparativoRoutes } from '@/features/comparativo/routes'
import { relatoriosRoutes } from '@/features/relatorios/routes'
import { authRoutes } from '@/features/auth/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Landing Page (pública)
    {
      path: '/',
      name: 'landing',
      component: () => import('@/features/landing/LandingPage.vue'),
      meta: { layout: 'none' },
    },

    // (MainLayout - rotas autenticadas)
    {
      path: '/app',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/app/dashboard',
        },
        ...dashboardRoutes,
        ...mapaCrimesRoutes,
        ...analyticsRoutes,
        ...comparativoRoutes,
        ...relatoriosRoutes,
        {
          path: 'importacao',
          component: () => import('@/features/importacao/ImportacaoPage.vue'),
        },
        {
          path: 'perfil',
          component: () => import('@/features/perfil/PerfilPage.vue'),
        },
      ],
    },

    // (AuthLayout)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        ...authRoutes,
      ],
    },

    // 404 - Página não encontrada
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/features/landing/NotFoundPage.vue'),
      meta: { layout: 'none' },
    },
  ],
})

// Guard de autenticação (executa antes de cada rota)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('g-seg-token')
  const isAuthRoute = to.path.startsWith('/app')

  if (isAuthRoute && !token) {
    next('/auth/login')
  } else if (to.path.startsWith('/auth') && token) {
    next('/app/dashboard')
  } else {
    next()
  }
})

export default router
