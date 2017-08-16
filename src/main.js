import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import axios from 'axios'

// 引入此模块就可以访问其映射的路由接口
import './mock/MockServer'

// 引入公用的样式
import './assets/style/index.styl'

// Vue 的插件在引入后都要主动声明使用，这样每个组件的 Vue 实例中才能使用该插件的方法
Vue.use(VueResource)

// 将 axios 添加到 Vue 的显式原型上，这样每个组件的 Vue 实例中才能访问到 axios 对象
// 否则就要在每个需要发送 ajax 请求的组件中单独引入 axios 模块
Vue.prototype.$ajax = axios

new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
})
