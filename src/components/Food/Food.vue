<template lang="html">
  <transition name="move">
    <!-- 这里要用 v-show 来控制 food 组件的显示和隐藏，不能用 v-if，否则的话，隐藏后整个 元素会消失，scroll 不会再生效 -->
    <div class="food" v-show="isShow" ref="food">
      <div class="food-content">
        <template v-if="isShow">
          <div class="image-header">
            <img :src="food.image">
            <div class="back">
              <span class="icon-arrow_lift" @click="show(false)"></span>
            </div>
          </div>

          <div class="content">
            <h1 class="title">{{ food.name }}</h1>
            <div class="detail">
              <span class="sell-count">月售 {{ food.sellCount }} 份</span>
              <span class="rating">好评率 {{ food.rating }}%</span>
            </div>
            <div class="price">
              <span class="now">￥{{ food.price }}</span>
              <span class="old" v-if="food.oldPrice">￥{{ food.oldPrice }}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cart-control :food="food" :update-food-count="updateFoodCount"></cart-control>
            </div>
            <div class="buy" v-show="!food.count" @click="updateFoodCount(food, true)">加入购物车</div>
          </div>

          <split></split>

          <div class="info">
            <h1 class="title">商品信息</h1>
            <p class="text">{{ food.description }}</p>
          </div>

          <split></split>

          <div class="rating">
            <h1 class="title">商品评价</h1>
            <rating-select :desc="{ all: '全部', positive: '满意', negative: '吐槽' }" :ratings="food.ratings" :only-content="onlyContent" :select-type="selectType" @setSelectType="setSelectType" @toggleOnlyContent="toggleOnlyContent"></rating-select>
            <div class="rating-wrapper">
              <ul>
                <li class="rating-item border-1px" v-for="r in filterRatings">
                  <div class="user">
                    <span class="name">{{ r.username }}</span>
                    <img class="avatar" :src="r.avatar" alt="avatar" width="12" height="12">
                  </div>
                  <div class="time">
                    {{ r.rateTime | date-string }}
                  </div>
                  <p class="text">
                    <span :class="r.rateType ? 'icon-thumb_down' : 'icon-thumb_up'"></span>
                    {{ r.text }}
                  </p>
                </li>
              </ul>
              <div class="no-rating" v-show="!food.ratings.length">暂无评价</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </transition>
</template>

<script>
import CartControl from '../CartControl/CartControl'
import Split from '../Split/Split'
import RatingSelect from '../RatingSelect/RatingSelect'

export default {
  props: {
    food: Object,
    updateFoodCount: Function
  },

  data () {
    return {
      isShow: false,
      onlyContent: true,
      selectType: 2
    }
  },

  methods: {
    show (isShow) {
      this.isShow = isShow

      if (this.isShow) { // 要显示
        this.$nextTick(() => {
          if (!this.scroll) { // 如果不存在才创建, 并保存
            this.scroll = new this.$scroll(this.$refs.food, {
              click: true
            })
          } else {
            // 每次打开 list 时刷新 scroll，以免 list 高度发生变化
            this.scroll.refresh()
          }
        })
      }
    },

    setSelectType (selectType) {
      this.selectType = selectType
      // 在 selectType 值更改后，导致页面重新渲染后，异步刷新 scroll
      // 这里直接写 this.scroll.refresh 是不行的，要用 bind 绑定 this
      // 否则 refresh 执行时会报错
      this.$nextTick(this.scroll.refresh.bind(this.scroll))
    },

    toggleOnlyContent () {
      this.onlyContent = !this.onlyContent
      // 在 selectType 值更改后，导致页面重新渲染后，异步刷新 scroll
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },

  computed: {
    filterRatings () {
      const { food, onlyContent, selectType } = this
      const ratings = food.ratings

      if (onlyContent) {
        if (selectType === 0) {
          return ratings.filter(r => r.rateType === 0 && r.text)
        } else if (selectType === 1) {
          return ratings.filter(r => r.rateType === 1 && r.text)
        } else {
          return ratings.filter(r => r.text)
        }
      } else {
        if (selectType === 0) {
          return ratings.filter(r => r.rateType === 0)
        } else if (selectType === 1) {
          return ratings.filter(r => r.rateType === 1)
        } else {
          return ratings
        }
      }
    }
  },

  components: { CartControl, Split, RatingSelect }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.food
  position: fixed
  left: 0
  top: 0
  bottom: 48px
  z-index: 30
  width: 100%
  background: #fff

  &.move-enter-active, &.move-leave-active
    transition: all .3s
  &.move-enter, &.move-leave-to
    opacity 0
    transform: translateX(100%)

  .image-header
    position: relative
    width: 100%
    height: 0
    padding-top: 100%
    img
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
    .back
      position: absolute
      top: 10px
      left: 0
      .icon-arrow_lift
        display: block
        padding: 10px
        font-size: 20px
        color: #fff

  .content
    position: relative
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 8px
      font-size: 14px
      font-weight: 700
      color: rgb(7, 17, 27)
    .detail
      margin-bottom: 18px
      line-height: 10px
      height: 10px
      font-size: 0
      .sell-count, .rating
        font-size: 10px
        color: rgb(147, 153, 159)
      .sell-count
        margin-right: 12px
    .price
      font-weight: 700
      line-height: 24px
      .now
        margin-right: 8px
        font-size: 14px
        color: rgb(240, 20, 20)
      .old
        text-decoration: line-through
        font-size: 10px
        color: rgb(147, 153, 159)
    .cartcontrol-wrapper
      position: absolute
      right: 12px
      bottom: 12px
    .buy
      position: absolute
      right: 18px
      bottom: 18px
      z-index: 10
      height: 24px
      line-height: 24px
      padding: 0 12px
      box-sizing: border-box
      border-radius: 12px
      font-size: 10px
      color: #fff
      background: rgb(0, 160, 220)
      &.fade-transition
        transition: all 0.2s
        opacity: 1
      &.fade-enter, &.fade-leave
        opacity: 0
  .info
    padding: 18px
    .title
      line-height: 14px
      margin-bottom: 6px
      font-size: 14px
      color: rgb(7, 17, 27)
    .text
      line-height: 24px
      padding: 0 8px
      font-size: 12px
      color: rgb(77, 85, 93)
  .rating
    padding-top: 18px
    .title
      line-height: 14px
      margin-left: 18px
      font-size: 14px
      color: rgb(7, 17, 27)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27, 0.1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size: 0
          .name
            display: inline-block
            margin-right: 6px
            vertical-align: top
            font-size: 10px
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom: 6px
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
          .icon-thumb_up, .icon-thumb_down
            margin-right: 4px
            line-height: 16px
            font-size: 12px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)

      .no-rating
        padding: 16px 0
        font-size: 12px
        color: rgb(147, 153, 159)
</style>
