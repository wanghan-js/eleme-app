import Vue from 'vue'
import Router from 'vue-router'

import Goods from '@/components/Goods/Goods'
import Ratings from '@/components/Ratings/Ratings'
import Seller from '@/components/Seller/Seller'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/goods'
    },
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/ratings',
      component: Ratings
    },
    {
      path: '/seller',
      component: Seller
    }
  ]
})
