import Vue from 'vue'
import Router from 'vue-router'
// 路由页面
import App from '@/components/index/app'
import workIndex from '@/components/work/index'
import newsIndex from '@/components/news/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'app',
      component: App
    },
    {
      path: '/work',
      name: 'work',
      component: workIndex
    },
    {
      path: '/news',
      name: 'news',
      component: newsIndex
    }
  ]
})
