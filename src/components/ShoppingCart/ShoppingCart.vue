<template lang="html">
  <div class="">
    <div class="shopcart">
      <div class="content">
        <div class="content-left"  @click="toggleFoods">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount }">
              <i class="icon-shopping_cart" :class="{ highlight: totalCount }"></i>
            </div>
            <div class="num" v-show="totalCount">
              {{ totalCount }}
            </div>
          </div>
          <div class="price">
            ￥{{ totalPrice }}
          </div>
          <div class="desc">
            另需配送费￥{{ deliveryPrice }} 元
          </div>
        </div>
        <div class="content-right">
          <div class="pay" :class="totalPrice >= minPrice ? 'enough' : 'not-enough'">
            {{ payText }}
          </div>
        </div>
      </div>
      <div class="ball-container">

      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="clearCart">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="f in foods">
                <span class="name">{{ f.name }}</span>
                <div class="price">
                  <span>￥{{ f.price }}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="f" :update-food-count="updateFoodCount"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleFoods">

      </div>
    </transition>
  </div>
</template>

<script>
import CartControl from '../CartControl/CartControl'

export default {
  props: {
    minPrice: Number,
    deliveryPrice: Number,
    foods: Array,
    updateFoodCount: Function,
    clearCart: Function
  },

  data () {
    return {
      isShow: false
    }
  },

  computed: {
    totalCount () {
      return this.foods.reduce((preTotal, food) => preTotal + food.count, 0)
    },

    totalPrice () {
      return this.foods.reduce((preTotal, food) => preTotal + food.count * food.price, 0)
    },

    payText () {
      const { totalPrice, minPrice } = this

      if (totalPrice === 0) {
        return `满 ￥${minPrice} 元起送`
      } else if (totalPrice < minPrice) {
        return `还差 ￥${minPrice - totalPrice} 元起送`
      } else {
        return '去结算'
      }
    },

    listShow () {
      if (this.totalCount === 0) {
        // 避免添加一个自动打开 list
        this.isShow = false
        return false
      }

      // 在列表即将打开的时候创建 scroll
      // 生成单例 scroll，避免每次打开 list 都重复创建一个 scroll
      // 使用 Vue 实例对象的 $nextTick 方法来控制在 DOM 渲染结束后才创建 scroll
      // 如果太早创建 scroll 则无法滚动（因为当 DOM 没有准备好时，无法得到元素的高度）
      if (this.isShow) {
        if (this.listScroll) {
          // 每次打开 list 时刷新 scroll，以免 list 高度发生变化
          this.listScroll.refresh()
        } else {
          this.$nextTick(() => {
            this.listScroll = new this.$scroll(this.$refs.listContent, {
              click: true
            })
          })
        }
      }

      return this.isShow
    }
  },

  methods: {
    toggleFoods () {
      this.isShow = !this.isShow
    }
  },

  components: { CartControl }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.shopcart
  position: fixed
  left: 0
  bottom: 0
  z-index: 50
  width: 100%
  height: 48px
  .content
    display: flex
    background: #141d27
    font-size: 0
    color: rgba(255, 255, 255, 0.4)
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        vertical-align: top
        position: relative
        top: -10px
        margin: 0 12px
        padding: 6px
        width: 56px
        height: 56px
        box-sizing: border-box
        border-radius: 50%
        background: #141d27
        .logo
          width: 100%
          height: 100%
          border-radius: 50%
          text-align: center
          background: #2b343c
          &.highlight
            background: rgb(0, 160, 220)
          .icon-shopping_cart
            line-height: 44px
            font-size: 24px
            color: #80858a
            &.highlight
              color: #fff
        .num
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          text-align: center
          border-radius: 16px
          font-size: 9px
          font-weight: 700
          color: #fff
          background: rgb(240, 20, 20)
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
      .price
        display: inline-block
        vertical-align: top
        margin-top: 12px
        line-height: 24px
        padding-right: 12px
        box-sizing: border-box
        border-right: 1px solid rgba(255, 255, 255, 0.1)
        font-size: 16px
        font-weight: 700
        &.highlight
          color: #fff
      .desc
        display: inline-block
        vertical-align: top
        margin: 12px 0 0 12px
        line-height: 24px
        font-size: 10px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        height: 48px
        line-height: 48px
        text-align: center
        font-size: 12px
        font-weight: 700
        &.not-enough
          background: #2b333b
        &.enough
          background: #00b43c
          color: #fff
  .ball-container
    .ball
      position: fixed
      left: 32px
      bottom: 22px
      z-index: 200
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background: rgb(0, 160, 220)
        transition: all 0.4s linear
  .shopcart-list
    position: absolute
    left: 0
    top: 0
    z-index: -1
    width: 100%
    transform: translateY(-100%)
    &.fold-enter-active, &.fold-leave-active
      transition: transform 0.5s
    &.fold-enter, &.fold-leave-to
      transform: translateY(0)
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: #f3f5f7
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      .title
        float: left
        font-size: 14px
        color: rgb(7, 17, 27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0, 160, 220)

    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background: #fff
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-1px(rgba(7, 17, 27, 0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7, 17, 27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240, 20, 20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 6px

.list-mask
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 40
  backdrop-filter: blur(10px)
  opacity: 1
  background: rgba(7, 17, 27, 0.6)
  &.fade-enter-active, &.fade-leave-active
    transition: all 0.5s
  &.fade-enter, &.fade-leave-to
    opacity: 0
    background: rgba(7, 17, 27, 0)
</style>