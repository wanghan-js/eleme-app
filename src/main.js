import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'

// 引入此模块就可以访问其映射的路由接口
import './mock/MockServer'

// 引入公用的样式
import './assets/style/index.styl'

// Vue 的插件在引入后都要主动声明使用
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
})
