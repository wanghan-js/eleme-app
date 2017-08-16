<template lang="html">
  <div class="">
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li class="menu-item" v-for="(g, index) in goods" :class="{current: currentIndex === index}" @click="clickMenuItem(index)">
            <span class="text border-1px">
              <span
                class="icon"
                v-if="g.type >= 0"
                :class="supportClasses[g.type]"
                ></span>
              {{ g.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="g in goods">
            <h1 class="title">{{ g.name }}</h1>
            <ul>
              <li class="food-item border-1px" v-for="f in g.foods">
                <div class="icon">
                  <img :src="f.icon" alt="food icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{ f.name }}</h2>
                  <p class="desc">{{ f.description }}</p>
                  <div class="extra">
                    <span class="count">月售 {{ f.sellCount }} 份</span>
                    <span>好评率 {{ f.rating }}

                      %</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{ f.price }}</span>
                    <span class="old" v-show="f.oldPrice">￥{{ f.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    cartcontrol 组件
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

const OK = 0

export default {
  data () {
    return {
      goods: [],
      supportClasses: [
        'decrease',
        'discount',
        'guarantee',
        'invoice',
        'special'
      ],
      tops: [],
      scrollY: 0
    }
  },

  created () {
    this.$ajax.get('/api2/goods')
      .then(response => {
        const result = response.data
        if (result.code === OK) {
          this.goods = result.data
          // 在 DOM 更新循环之后执行 $nextTick 的回调函数，是一个异步操作
          this.$nextTick(() => {
            // 初始化 scroll
            this._initScroll()
            // 收集所有 li 的 top 值，即每个 li 和整个滑动元素顶部之间的距离
            this._initTops()
          })
        }
      })
  },

  methods: {
    // 组件内部使用的方法可以在命名时加上下划线
    _initScroll () {
      // 创建左侧菜单列表的 scroll
      // 注意需要滑动的元素不能有兄弟元素，也就是 wrapper 元素只能有一个孩子
      new BScroll(this.$refs.menuWrapper, {
        click: true // 开启滑动元素的 click 事件，参考 better-scroll 的文档
      })
      // 创建右侧食物列表的 scroll
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3 // 接收 scroll 事件，参考 better-scroll 的文档
      })

      // 监视 scroll 事件，滑动过程中自动收集 scrollY 的值
      this.foodsScroll.on('scroll', pos => (this.scrollY = Math.abs(pos.y)))
    },

    _initTops () {
      const tops = []
      let top = 0
      // 第一个 li 的 top 值
      tops.push(top)
      // 找到所有 li
      const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
      // 遍历 lis 计算每个 li 的 top 值，并保存到 tops 数组中
      Array.prototype.forEach.call(lis, li => {
        top += li.clientHeight
        tops.push(top)
      })
      this.tops = tops
    },

    clickMenuItem (index) {
      // 得到对应的 li
      const li = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')[index]
      // 通过 foodsScroll 来平滑的滚动到指定的 li 处
      this.foodsScroll.scrollToElement(li, 500)
    }
  },

  computed: {
    currentIndex () {
      const { tops, scrollY } = this
      // scrollY 的值等于或大于当前下标的值，并且小于下一个值
      // 此时得到的下标就是 currentIndex
      // 数组的 findIndex 方法返回其回调参数结果第一次为 true 时的 index 值
      return tops.findIndex((top, index) => {
        return scrollY >= top && scrollY < tops[index + 1]
      })
    }
  }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      line-height: 14px
      &.current
        position: relative
        z-index: 10
        margin-top: -1px
        background: #fff
        font-weight: 700
        .text
          border-none()
      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('./image/decrease_3')
        &.discount
          bg-image('./image/discount_3')
        &.guarantee
          bg-image('./image/guarantee_3')
        &.invoice
          bg-image('./image/invoice_3')
        &.special
          bg-image('./image/special_3')
      .text
        display: table-cell
        width: 56px
        vertical-align: middle
        border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
  .foods-wrapper
    flex: 1
    .title
      padding-left: 14px
      height: 26px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.1))
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px 0
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          line-height: 12px
          margin-bottom: 8px
        .extra
          .count
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
          right: 0
          bottom: 12px
</style>
