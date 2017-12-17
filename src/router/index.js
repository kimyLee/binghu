import Vue from 'vue'
import Router from 'vue-router'
import world from '@/views/world'
import start from '@/views/start'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'start',
      component: start
    },
    {
      path: '/word',
      name: 'word',
      component: world
    }
  ]
})
