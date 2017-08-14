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
import Header from './components/Header/Header'

export default {
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
