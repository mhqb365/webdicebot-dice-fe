import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Dice from '@/views/Dice'
import Register from '@/views/Register'
import Login from '@/views/Login'
import Deposit from '@/views/Deposit'
import Withdraw from '@/views/Withdraw'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: { requiresAuth: true }
    },
    {
      path: '/dice',
      name: 'Dice',
      component: Dice,
      meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/deposit',
      name: 'Deposit',
      component: Deposit,
      meta: { requiresAuth: true }
    },
    {
      path: '/withdraw',
      name: 'Withdraw',
      component: Withdraw,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    !localStorage.getItem('token') ? next({ path: '/login' }) : next()
  }
  else {
    next()
  }
})

export default router