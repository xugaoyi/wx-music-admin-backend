const Router = require('koa-router') // 用于写后端提供给前端的接口
const callCloudFn = require('../utils/callCloudFn') // 调用云函数的封装
const router = new Router() // 初始化koa-router

// 查询歌单列表
router.get('/list', async (ctx, next) => { // get 前端向后端取数据，如提交数据为明文的 ，post 前端向后端提交数据

  const query = ctx.request.query // 前端传递来的参数

  // 参数：1 上下文，2 云函数名称，3 传给云函数的参数
  const res = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    start: parseInt(query.start),
    count: parseInt(query.count)
  })

  let data = []
  if (res.resp_data) {
    data = JSON.parse(res.resp_data).data
  }
   ctx.body = {
      data,
      code: 20000 // 前端模板要求需要此状态码表示请求成功
   } 
})

module.exports = router