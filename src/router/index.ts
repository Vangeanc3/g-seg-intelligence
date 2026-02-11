import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/core/auth/authService'

import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Rotas por feature
import { dashboardRoutes } from '@/features/dashboard/routes'
import { mapaCrimesRoutes } from '@/features/mapa-crimes/routes'
import { analyticsRoutes } from '@/features/analytics/routes'
import { relatoriosRoutes } from '@/features/relatorios/routes'
import { authRoutes } from '@/features/auth/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // (MainLayout)
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        ...dashboardRoutes,
        ...mapaCrimesRoutes,
        ...analyticsRoutes,
        ...relatoriosRoutes,
      ],
    },

    // (AUthLayout)
    {
      path: '/auth',
      component: AuthLayout,
      children: [
        ...authRoutes,
      ],
    },

    // 404 - Redireciona para dashboard
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

// Guard de autenticação (executa antes de cada rota)
router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const isAuthenticated = authService.isAuthenticated()

  if (requiresAuth && !isAuthenticated) {
    next('/auth/login')
  } else if (to.path.startsWith('/auth') && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
