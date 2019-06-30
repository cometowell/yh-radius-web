import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: "history",
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
        component: () => import('@/views/index/Index')
      }]
    }
  ]
})
