import Vue from 'vue'
import Router from 'vue-router'
import world from '@/views/world'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'world',
      component: world
    }
  ]
})
