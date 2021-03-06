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
        path: '/about',
        name: 'about',
        requireAuth: true,
        component: () => import('@/views/index/About')
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
        component: () => import('@/views/user/UserAdd')
      },
      {
        path: '/user/modify',
        name: 'userModify',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/user/UserModify')
      },
      {
        path: '/product',
        name: 'product',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/product/Product')
      },
      {
        path: '/product/add',
        name: 'productAdd',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/product/ProductAdd')
      },
      {
        path: '/product/modify',
        name: 'productModify',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/product/ProductModify')
      },
      {
        path: '/online',
        name: 'online',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/online/Online')
      },
      {
        path: '/nas',
        name: 'nas',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/nas/Nas')
      },
      {
        path: '/sysUser',
        name: 'systemUser',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/sysUser/User')
      },
      {
        path: '/change/password',
        name: 'changePassword',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/sysUser/ChangePassword')
      },
      {
        path: '/department',
        name: 'department',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/department/Department')
      },
      {
        path: '/resource',
        name: 'resource',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/res/Resource')
      },
      {
        path: '/role',
        name: 'role',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/role/Role')
      },
      {
        path: '/area',
        name: 'area',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/area/Area')
      },
      {
        path: '/town',
        name: 'town',
        meta: {
          requireAuth: true
        },
        component: () => import('@/views/town/Town')
      }]
    }
  ]
})
