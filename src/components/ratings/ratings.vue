<template lang="html">
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">
            综合评分
          </div>
          <div class="rank">
            高于周边商家 {{ seller.rankRate }}%
          </div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }} 分钟</span>
          </div>
        </div>
      </div>

      <split></split>

      <rating-select :desc="{ all: '全部', negative: '不满意', positive: '满意' }" :only-content="onlyContent" :ratings="ratings" :select-type="selectType" @setSelectType="setSelectType" @toggleOnlyContent="toggleOnlyContent"></rating-select>

      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-for="r in filterRatings">
            <div class="avatar">
              <img :src="r.avatar" alt="avatar" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{ r.username }}</h1>
              <div class="star-wrapper">
                <star :score="r.score" :size="24"></star>
                <span class="delivery">{{ r.deliveryTime }}</span>
              </div>
              <p class="text">{{ r.text }}</p>
              <div class="recommend">
                <span :class="r.rateType === 0 ? 'icon-thumb_up' : 'icon-thumb_down'"></span>
                <span class="item" v-for="item in seller.recommend">{{ item }}</span>
              </div>
              <div class="time">
                {{ r.rateTime | date-string }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Star from '../Star/Star'
import Split from '../Split/Split'
import RatingSelect from '../RatingSelect/RatingSelect'

const OK = 0
export default {
  props: ['seller'],

  data () {
    return {
      ratings: [],
      onlyContent: true,
      selectType: 2
    }
  },

  created () {
    this.$ajax.get('/api2/ratings')
      .then(response => {
        const result = response.data
        if (result.code === OK) {
          this.ratings = result.data
          this.$nextTick(() => {
            this.scroll = new this.$scroll(this.$refs.ratings, {
              click: true
            })
          })
        }
      })
      .catch(error => console.log(error))
  },

  computed: {
    filterRatings () {
      const { ratings, onlyContent, selectType } = this

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

  methods: {
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

  components: { Star, Split, RatingSelect }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.ratings
  position: absolute
  top: 174px
  bottom: 0
  left: 0
  width: 100%
  overflow: hidden
  .overview
    display: flex
    padding: 18px 0
    .overview-left
      flex: 0 0 137px
      padding: 6px 0
      width: 137px
      border-right: 1px solid rgba(7, 17, 27, 0.1)
      text-align: center
      @media only screen and (max-width: 320px)
        flex: 0 0 120px
        width: 120px
      .score
        margin-bottom: 6px
        line-height: 28px
        font-size: 24px
        color: rgb(255, 153, 0)
      .title
        margin-bottom: 8px
        line-height: 12px
        font-size: 12px
        color: rgb(7, 17, 27)
      .rank
        line-height: 10px
        font-size: 10px
        color: rgb(147, 153, 159)
    .overview-right
      flex: 1
      padding: 6px 0 6px 24px
      @media only screen and (max-width: 320px)
        padding-left: 6px
      .score-wrapper
        margin-bottom: 8px
        font-size: 0
        .title
          display: inline-block
          line-height: 18px
          vertical-align: top
          font-size: 12px
          color: rgb(7, 17, 27)
        .stars
          display: inline-block
          margin: 0 12px
          vertical-align: top
        .score
          display: inline-block
          line-height: 18px
          vertical-align: top
          font-size: 12px
          color: rgb(255, 153, 0)
      .delivery-wrapper
        font-size: 0
        .title
          line-height: 18px
          font-size: 12px
          color: rgb(7, 17, 27)
        .delivery
          margin-left: 12px
          font-size: 12px
          color: rgb(147, 153, 159)
  .rating-wrapper
    padding: 0 18px
    .rating-item
      display: flex
      padding: 18px 0
      border-1px(rgba(7, 17, 27, 0.1))
      .avatar
        flex: 0 0 28px
        width: 28px
        margin-right: 12px
        img
          border-radius: 50%
      .content
        position: relative
        flex: 1
        .name
          margin-bottom: 4px
          line-height: 12px
          font-size: 10px
          color: rgb(7, 17, 27)
        .star-wrapper
          margin-bottom: 6px
          font-size: 0
          .stars
            display: inline-block
            margin-right: 6px
            vertical-align: top
          .delivery
            display: inline-block
            vertical-align: top
            line-height: 12px
            font-size: 10px
            color: rgb(147, 153, 159)
        .text
          margin-bottom: 8px
          line-height: 18px
          color: rgb(7, 17, 27)
          font-size: 12px
        .recommend
          line-height: 16px
          font-size: 0
          .icon-thumb_up, .icon-thumb_down, .item
            display: inline-block
            margin: 0 8px 4px 0
            font-size: 9px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)

          .item
            padding: 0 6px
            border: 1px solid rgba(7, 17, 27, 0.1)
            border-radius: 1px
            color: rgb(147, 153, 159)
            background: #fff
        .time
          position: absolute
          top: 0
          right: 0
          line-height: 12px
          font-size: 10px
          color: rgb(147, 153, 159)
</style>
