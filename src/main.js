// 引入第三方库
import Vue from 'vue'
import VueResource from 'vue-resource'
import axios from 'axios'
import BScroll from 'better-scroll'
import moment from 'moment'

// 引入自定义组件
import App from './App'
import router from './router'

// 引入此模块就可以访问其映射的路由接口
import './mock/MockServer'

// 引入公用的样式，这样就不用在每个组件单独引用，但是注意类似混入，函数，变量之类的不会出现在
// style 标签中的样式，哪个组件要用，就在哪个组件引入
import './assets/style/index.styl'

// Vue 的插件在引入后都要主动声明使用，这样每个组件的 Vue 实例中才能使用该插件的方法
Vue.use(VueResource)

// 注册一个处理日期的全局过滤器
Vue.filter('date-string', value => moment(value).format('YYYY-MM-DD HH:mm:ss'))

// 将 axios 添加到 Vue 的显式原型上，这样每个组件的 Vue 实例中才能访问到 axios 对象
// 否则就要在每个需要发送 ajax 请求的组件中单独引入 axios 模块
// 其他组件公用的库，都可以这样操作
Vue.prototype.$ajax = axios
Vue.prototype.$scroll = BScroll

new Vue({
  el: '#app',
  router,
  template: '<App />',
  components: { App }
})
