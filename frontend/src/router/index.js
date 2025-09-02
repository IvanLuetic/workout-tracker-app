import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/DashboardView.vue'
import AuthPage from '@/views/AuthPage.vue'
import { forbidUnauthenticated } from './navigationGuard'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage,
      beforeEnter: forbidUnauthenticated,
    },
    {
      path: '/auth',
      name: 'AuthPage',
      component: AuthPage,
    },
    /*  {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/admin/Dashboard.vue')
        },
        {
          path: 'users',
          component: () => import('@/views/admin/Users.vue')
        }
      ]
    } */
  ],
})

export default router
