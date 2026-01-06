import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/views/Rank.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    redirect: '/dashboard/statistics',
    children: [{
      path: 'group',
      name: 'Group',
      component: () => import('@/views/Dashboard/Group.vue')
    },
    {
      path: 'member',
      name: 'Member',
      component: () => import('@/views/Dashboard/Member.vue')
    },
    {
      path: 'statistics',
      name: 'Statistics',
      component: () => import('@/views/Dashboard/Statistics.vue')
    }]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
