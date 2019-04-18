import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import SignIn from '@/views/SignIn'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: SignIn
    }
  ]
})
