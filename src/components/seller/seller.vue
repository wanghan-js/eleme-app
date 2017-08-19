<template lang="html">
  <div class="seller" ref="seller">
    <div class="seller-content">

      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>

        <div class="desc border-1px">
          <star :score="seller.score" :size="36"></star>
          <span class="text">{{ seller.sellCount }}</span>
          <span class="text">月售单</span>
        </div>

        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span> 元
            </div>
          </li>

          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span> 元
            </div>
          </li>

          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span> 分钟
            </div>
          </li>
        </ul>

        <div class="favorite">
          <span class="icon-favorite" :class="{ active: favorite }" @click="toggleFavorite"></span>
          <span class="text">{{ favorite ? '已收藏' : '收藏' }}</span>
        </div>
      </div>

      <split></split>

      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
        <ul class="supports">
          <li class="support-item border-1px" v-for="s in seller.supports">
            <span class="icon" :class="supportClasses[s.type]"></span>
            <span class="text">{{ s.description }}</span>
          </li>
        </ul>
      </div>

      <split></split>

      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picsUl">
            <li class="pic-item" v-for="p in seller.pics">
              <img :src="p" alt="" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>

      <split></split>

      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="i in seller.infos">{{ i }}</li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import Star from '../Star/Star'
import Split from '../Split/Split'

export default {
  props: ['seller'],
  data () {
    return {
      favorite: localStorage.getItem('favorite'),
      supportClasses: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
  },

  created () {
    // 如果 seller 页面是从其他页面点击路由链接跳转过来的，那在 seller 页面初始化显示时
    // seller 属性就是有值的，而如果是直接在 seller 页面进行刷新的话，seller 实际上
    // 还是一个空对象，因为在 App 组件中发送 ajax 请求获取 seller 的数据是异步执行的
    // 所以，如果 seller 没值，什么也不做，并监视 seller 的值的变化，当它更新时，再更新界面
    // 如果有值就直接显示界面
    if (this.seller.name) {
      this._showSeller()
    }
  },

  methods: {
    _showSeller () {
      this.$nextTick(() => {
        this.scroll = new this.$scroll(this.$refs.seller, {
          click: true
        })

        // 统计 ul 所需要的宽度
        const picWidth = 120
        const space = 6
        const imgCount = this.seller.pics.length

        // 因为默认情况下，容器ul 的宽度为屏幕宽度的 100%，这样的话无法滑动
        // 所以必需手动给 ul 设置宽度，宽度大小为里面 li 的宽度之和
        this.$refs.picsUl.style.width = imgCount * (picWidth + space) - space + 'px'

        // 创建水平滑动的 scroll
        this.picsScroll = new this.$scroll(this.$refs.picWrapper, {
          scrollX: true // 指定滑动方向为水平方向
        })
      })
    },

    toggleFavorite () {
      this.favorite = !this.favorite
      // 保存 favorite 的状态
      localStorage.setItem('favorite', this.favorite)
    }
  },

  watch: {
    // seller 的值发生变化，就执行此函数
    seller (newValue, oldValue) {
      this._showSeller()
    }
  },

  components: { Star, Split }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.seller
  position: absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    position: relative
    padding: 18px
    .title
      margin-bottom: 8px
      line-height: 14px
      color: rgb(7, 17, 27)
      font-size: 14px
    .desc
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .stars
        display: inline-block
        margin-right: 8px
        vertical-align: top
      .text
        display: inline-block
        margin-right: 12px
        line-height: 18px
        vertical-align: top
        font-size: 10px
        color: rgb(77, 85, 93)
    .remark
      display: flex
      padding-top: 18px
      .block
        flex: 1
        text-align: center
        border-right: 1px solid rgba(7, 17, 27, 0.1)
        &:last-child
          border: none
        h2
          margin-bottom: 4px
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .content
          line-height: 24px
          font-size: 10px
          color: rgb(7, 17, 27)
          .stress
            font-size: 24px
    .favorite
      position: absolute
      width: 50px
      right: 11px
      top: 18px
      text-align: center
      .icon-favorite
        display: block
        margin-bottom: 4px
        line-height: 24px
        font-size: 24px
        color: #d4d6d9
        &.active
          color: rgb(240, 20, 20)
      .text
        line-height: 10px
        font-size: 10px
        color: rgb(77, 85, 93)
  .bulletin
    padding: 18px 18px 0 18px
    .title
      margin-bottom: 8px
      line-height: 14px
      color: rgb(7, 17, 27)
      font-size: 14px
    .content-wrapper
      padding: 0 12px 16px 12px
      border-1px(rgba(7, 17, 27, 0.1))
      .content
        line-height: 24px
        font-size: 12px
        color: rgb(240, 20, 20)
    .supports
      .support-item
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        &:last-child
          border-none()
      .icon
        display: inline-block
        width: 16px
        height: 16px
        vertical-align: top
        margin-right: 6px
        background-size: 16px 16px
        background-repeat: no-repeat
        &.decrease
          bg-image('./image/decrease_4')
        &.discount
          bg-image('./image/discount_4')
        &.guarantee
          bg-image('./image/guarantee_4')
        &.invoice
          bg-image('./image/invoice_4')
        &.special
          bg-image('./image/special_4')
      .text
        line-height: 16px
        font-size: 12px
        color: rgb(7, 17, 27)
  .pics
    padding: 18px
    .title
      margin-bottom: 12px
      line-height: 14px
      color: rgb(7, 17, 27)
      font-size: 14px
    .pic-wrapper
      width: 100%
      overflow: hidden
      white-space: nowrap
      .pic-list
        font-size: 0
        .pic-item
          display: inline-block
          margin-right: 6px
          width: 120px
          height: 90px
          &:last-child
            margin: 0
  .info
    padding: 18px 18px 0 18px
    color: rgb(7, 17, 27)
    .title
      padding-bottom: 12px
      line-height: 14px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 14px
    .info-item
      padding: 16px 12px
      line-height: 16px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 12px
      &:last-child
        border-none()
</style>
