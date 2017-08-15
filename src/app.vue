<template lang="html">
  <div>
    <ele-header></ele-header>

    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios'

import Header from './components/Header/Header'

export default {
  created () {
    // 使用 vue-resource 发送 ajax 请求 express 提供的模拟接口
    this.$http.get('/api/goods')
      .then(response => {
        const result = response.body
        console.log('vue-resource', result)
      })
    // 使用 axios 发送 ajax 请求 mockjs 提供的模拟接口
    axios.get('/api2/seller')
      .then(response => {
        const result = response.data
        console.log('axios', result)
      })
  },

  components: { 'ele-header': Header }
}
</script>

<style lang="stylus">
@import './assets/style/mixin.styl'

.tab
  display flex
  height 40px
  line-height 40px
  font-size 14px
  border-1px(pink)
  .tab-item
    width 0
    flex 1
    text-align center
    a
      display block
      color rgb(77, 85, 93)
    .active
      color rgb(240, 20, 20)
</style>
