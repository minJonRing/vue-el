import Vue from 'vue'
import Router from 'vue-router'
// 路由页面
import App from '@/components/index/app'
import workIndex from '@/components/work/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app',
      component: App
    },
    {
      path: '/work-index',
      name: 'work-index',
      component: workIndex
    }
  ]
})
