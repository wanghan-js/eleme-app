<template lang="html">
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64" alt="avatar">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <div class="description">
          {{ seller.description }} / {{ seller.deliveryTime }}分钟送达
        </div>
        <!--
          这里必须要加 v-if 判断是否渲染，因为 ajax 请求数据是异步的，而模版是立即解析的，
          在还没拿到数据时，seller 是个空对象，读取一个空对象的值时返回 undefined
          再读取这个 undefined 的值会报错，所以在 seller 为空对象时不能渲染此标签
        -->
        <div class="supports" v-if="seller.supports">
          <span class="icon" :class="supportClasses[seller.supports[0].type]"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <div class="support-count" v-if="seller.supports" @click="showDetail(true)">
        <span>{{ seller.supports.length }} 个</span>
        <span class="icon-keyboard_arrow_right"></span>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail(true)">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">
        {{ seller.bulletin }}
      </span>
      <span class="icon-keyboard_arrow_right"></span>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" alt="">
    </div>
    <transition name="fade">
      <div class="mask" v-show="isShow">
      <div class="mask-wrapper">
        <div class="mask-main">
          <h1 class="title">{{ seller.name }}</h1>
          <div class="stars-wrapper" v-if="seller.score">
            <star :score="seller.score" :size="48"></star>
          </div>
          <div class="info">
            <div class="line">

            </div>
            <div class="text">
              优惠信息
            </div>
            <div class="line">

            </div>
          </div>
          <ul class="list">
            <li v-for="item in seller.supports">
              <span class="icon" :class="supportClasses[item.type]"></span>
              <span class="text">{{ item.description }}</span>
            </li>
          </ul>
          <div class="info">
            <div class="line">

            </div>
            <div class="text">
              商家公告
            </div>
            <div class="line">

            </div>
          </div>
          <div class="content">
            <p class="text">
              {{ seller.bulletin }}
            </p>
          </div>
        </div>
      </div>
      <div class="mask-footer">
        <span class="icon-close" @click="showDetail(false)"></span>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import Star from '../Star/Star'

export default {
  props: ['seller'],
  data () {
    return {
      supportClasses: [
        'decrease',
        'discount',
        'guarantee',
        'invoice',
        'special'
      ],
      isShow: false
    }
  },

  methods: {
    showDetail (isShow) {
      this.isShow = isShow
    }
  },

  components: { Star }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.header
  position relative
  color rgb(255, 255, 255)
  background rgba(7, 17, 27, .5)
  overflow hidden
  font-size 0
  .content-wrapper
    position relative
    margin 24px 12px 18px 24px
    .avatar
      display inline-block
      vertical-align top
      img
        border-radius 2px
    .content
      display inline-block
      margin-left 16px
      .title
        margin 2px 0 8px
        .brand
          display inline-block
          vertical-align top
          width 30px
          height 18px
          background-size 100% 100%
          background-repeat no-repeat
          bg-image("./image/brand")
        .name
          margin-left 6px
          font-size 16px
          font-weight bold
          line-height 18px
      .description
        font-size 12px
        line-height 12px
        font-weight 200
        margin-bottom 10px
      .supports
        margin-bottom 2px
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          background-size 100% 100%
          background-repeat no-repeat
          &.decrease
            bg-image("./image/decrease_1")
          &.discount
            bg-image("./image/discount_1")
          &.guarantee
            bg-image("./image/guarantee_1")
          &.invoice
            bg-image("./image/invoice_1")
          &.special
            bg-image("./image/special_1")
        .text
          margin-left 4px
          font-size 10px
          line-height 12px
          font-weight 200
    .support-count
      position absolute
      right 0
      bottom 0
      border-radius 16px
      width 48px
      height 24px
      background-color rgba(0, 0, 0, .2)
      font-size 10px
      line-height 12px
      font-weight 200
      text-align center
      span
        line-height 24px
  .bulletin-wrapper
    position relative
    background-color rgba(7, 17, 27, .2)
    padding 0 28px 0 12px
    font-size 10px
    font-weight 200
    height 28px
    line-height 28px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    .bulletin-title
      margin-top 8px
      vertical-align top
      display inline-block
      width 22px
      height 12px
      background-repeat no-repeat
      background-size 100% 100%
      bg-image("./image/bulletin")
    .icon-keyboard_arrow_right
      position absolute
      right 12px
      line-height 28px
      bottom 0
  .background
    position absolute
    left 0
    top 0
    z-index -1
    width 100%
    height 100%
    filter blur(10px)
  .mask
    position fixed
    left 0
    top 0
    z-index 99
    width 100%
    height 100%
    background rgba(7, 17, 27, .8)
    overflow auto
    &.fade-enter-active
    &.fade-leave-active
      transition opacity .5s
    &.fade-enter
    &.fade-leave-to
      opacity 0
    .mask-wrapper
      min-height 100%
      .mask-main
        padding-top 64px
        padding-bottom 64px
        .title
          font-size 16px
          line-height 16px
          font-weight 700
          text-align center
        .stars-wrapper
          height 24px
          margin 16px 0 28px 0
        .info
          display flex
          width 80%
          margin 0 auto 24px
          .line
            flex 1
            position relative
            top 8px
            height 1px
            background-color rgba(255, 255, 255, .2)
          .text
            margin 0 12px
            font-size 16px
            line-height 16px
            font-weight 700
        .list
          width 80%
          margin 0 auto 28px
          li
            margin-bottom 12px
            margin-left 12px
            &:last-child
              margin-bottom 0
            .icon
              display inline-block
              vertical-align top
              width 16px
              height 16px
              background-repeat no-repeat
              background-size 100% 100%
              &.decrease
                bg-image("./image/decrease_2")
              &.discount
                bg-image("./image/discount_2")
              &.guarantee
                bg-image("./image/guarantee_2")
              &.invoice
                bg-image("./image/invoice_2")
              &.special
                bg-image("./image/special_2")
            .text
              margin-left 6px
              font-size 12px
              line-height 12px
              font-weight 200
        .content
          width 80%
          margin 0 auto
          .text
            padding 0 12px
            font-size 12px
            line-height 24px
            font-weight 200
    .mask-footer
      text-align center
      font-size 32px
      color rgba(255, 255, 255, .5)
      margin-top -64px
</style>
