import { createRouter, createWebHistory } from 'vue-router'
import JWT from '@/utils/jwt'
// 登录守卫路由
const loginGuard = (to: any, from: any, next: any) => {
  if (JWT.isValid()) {
    next()
  } else {
    next({
      name: 'Login',
      query: { 
        redirect: to.fullPath 
      }
    })
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    beforeEnter: loginGuard
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    beforeEnter: loginGuard
  },
  {
    path: '/changeProfile',
    name: 'ChangeProfile',
    component: () => import('@/views/ChangeProfile.vue'),
    beforeEnter: loginGuard
  },
  {
    path: '/allActivities',
    name: 'AllActivities',
    component: () => import('@/views/AllActivities.vue')
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
    beforeEnter: loginGuard,
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
    path: '/competition',
    name: 'Competition',
    component: () => import('@/views/Competition.vue'),
  },
  {
    path: '/competition/:id',
    name: 'Competition Details',
    component: () => import('@/views/Competition/Details.vue')
  },
  {
    path: '/star',
    name: 'Star',
    component: () => import("@/views/Star.vue"),
    beforeEnter: loginGuard
  },
  {
    path: '/problem',
    name: 'Problem',
    component: () => import("@/views/Problem.vue")
  },
  {
    path: '/problem/upload',
    name: 'Problem Upload',
    component: () => import("@/views/Problem/Upload.vue"),
    beforeEnter: loginGuard
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
