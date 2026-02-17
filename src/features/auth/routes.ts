import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('./LoginPage.vue'),
    meta: {
      title: 'Login',
    },
  },
  {
    path: 'registro',
    name: 'registro',
    component: () => import('./RegistroPage.vue'),
    meta: {
      title: 'Criar Conta',
    },
  },
  {
    path: 'esqueci-senha',
    name: 'esqueci-senha',
    component: () => import('./EsqueciSenhaPage.vue'),
    meta: {
      title: 'Recuperar Senha',
    },
  },
]
