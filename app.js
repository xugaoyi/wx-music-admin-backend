const Koa = require('koa')
const Router = require('koa-router') // 用于写后端提供给前端的接口
const chalk = require('chalk') // 改变console.log打印颜色的插件
const cors = require('koa2-cors') // 解决跨域问题

const ENV = 'dev-xgy' // 云开发环境ID (下面会赋值给全局属性)

const app = new Koa()
const router = new Router()

//处理跨域
app.use(cors({
  origin: ['http://localhost:9528'], // 允许访问本服务的域
  credentials: true
}))

// 全局中间件
app.use(async (ctx, next) => { // ctx 上下文，所以中间件都可访问其属性
  // ctx.body = 'Hello Wolrd' // http://localhost:3000 访问到的数据
  ctx.state.env = ENV // 赋值给全局属性，其他中间件可通过ctx.state.env使用
  await next()
})

const playlist = require('./controller/playlist.js')
router.use('/playlist', playlist.routes()) // 前端访问：http://localhost:3000/playlist + <playlist.js内部的子路由>

app.use(router.routes()) // 使用路由
app.use(router.allowedMethods()) // 允许使用方法


const port = 3000
app.listen(port, () => { // 端口号，开启服务后的回调函数
  console.log(chalk.green(`> 服务已开启，访问：http://localhost:${port}`))
})

/**
 * MVC模式
 * M => model模型 V => view视图  C => controller控制器
 * 
 * M: 和数据库、数据打交道的
 * V: 后台管理系统页面
 * C: M和C之间的桥梁，本项目的controller文件夹内放C层代码
 */