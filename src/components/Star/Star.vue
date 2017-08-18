<template lang="html">
  <div class="stars" v-if="score" :class="`stars-${size}`">
    <span class="star" v-for="s in starClasses" :class="s"></span>
  </div>
</template>

<script>
export default {
  props: {
    size: Number,
    score: Number
  },

  computed: {
    starClasses () {
      const score = this.score
      let stars = Array(Math.floor(score)).fill('on')
      Math.round(score) >= score && stars.push('half')
      return [...stars, ...Array(5 - Math.round(score)).fill('off')]
    }
  }
}
</script>

<style lang="stylus">
@import "../../assets/style/mixin.styl"

.stars
  text-align center
  .star
    display inline-block
    background-repeat no-repeat
    background-size 100% 100%
  &.stars-48
    .star
      width 20px
      height 19px
      margin-right 20px
      &:last-child
        margin-right 0
      &.on
        bg-image("./image/star48_on")
      &.half
        bg-image("./image/star48_half")
      &.off
        bg-image("./image/star48_off")
  &.stars-36
    .star
      width 15px
      height 15px
      margin-right 15px
      &:last-child
        margin-right 0
      &.on
        bg-image("./image/star36_on")
      &.half
        bg-image("./image/star36_half")
      &.off
        bg-image("./image/star36_off")
  &.stars-24
    .star
      width 10px
      height 10px
      margin-right 10px
      &:last-child
        margin-right 0
      &.on
        bg-image("./image/star24_on")
      &.half
        bg-image("./image/star24_half")
      &.off
        bg-image("./image/star24_off")
</style>
