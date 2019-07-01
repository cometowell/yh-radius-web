import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/Login')
    },
    {
      path: '/index',
      component: () => import('@/views/Main'),
      children: [{
        path: '',
        name: 'index',
        requireAuth: true,
        component: () => import('@/views/index/Index')
      },
      {
        path: '/user',
        name: 'user',
        requireAuth: true,
        component: () => import('@/views/user/User')
      },
      {
        path: '/user/add',
        name: 'userAdd',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/user/UserAdd.vue')
      },
      {
        path: '/user/modify',
        name: 'userModify',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/user/UserModify.vue')
      },
      {
        path: '/product',
        name: 'product',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/product/Product.vue')
      }]
    }
  ]
})
