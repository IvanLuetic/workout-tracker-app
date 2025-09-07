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
    {
      path: '/about',
      name: 'AboutPage',
      component: () => import('@/views/AboutPage.vue'),
    },

    {
      path: '/profile',
      name: 'ProfilePage',
      component: () => import('@/views/ProfilePage.vue'),
      beforeEnter: forbidUnauthenticated,
    },
    {
      path: '/sessions',
      name: 'SessionsPage',
      component: () => import('@/views/SessionsPage.vue'),
      beforeEnter: forbidUnauthenticated,
    },
  ],
})

export default router
