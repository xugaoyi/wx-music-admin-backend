const Koa = require('koa')
const chalk = require('chalk')
const app = new Koa()

app.use(async (ctx) => {
  ctx.body = 'Hello Wolrd'
})
const port = 3000
app.listen(port, () => { // 端口号，开启服务后的回调函数
  console.log(chalk.green(`> 服务已开启，访问：http://localhost:${port}`))
}) 