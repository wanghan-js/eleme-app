// 使用 mockjs 实现模拟接口，它提供的 api 接口只能通过 ajax 的方式访问
// 因为 mockjs 这个包它只能拦截 ajax 请求，并返回数据，而不能拦截浏览器 HTTP 请求

import Mock from 'mockjs'
// 引入需要返回的 json 数据；mockjs 本身也可以通过一定的规则生成随机 json 数据
// 查看其文档了解生成随机数据的方式
import data from './data.json'

// 映射路由
Mock.mock('/api2/goods', {
  code: 0,
  data: data.goods
})

Mock.mock('/api2/ratings', {
  code: 0,
  data: data.ratings
})

Mock.mock('/api2/seller', {
  code: 0,
  data: data.seller
})

// 不需要 export 暴露，因为只要执行代码后，接口就可以使用了，它是相对独立的
// 所以只需要在入口文件 main.js 文件中 import 把它引入一次就可以了
