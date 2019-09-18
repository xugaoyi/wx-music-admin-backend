/**
 * 歌单管理，接口
 */

const Router = require('koa-router') // 用于写后端提供给前端的接口
const callCloudFn = require('../utils/callCloudFn') // 调用云函数的封装
const callCloudDB = require('../utils/callCloudDB') // 操作云数据库的封装
const router = new Router() // 初始化koa-router


// 查询歌单列表
router.get('/list', async (ctx, next) => { // get 前端向后端取数据，如提交数据为明文的 ，post 前端向后端提交数据

  const query = ctx.request.query // 前端传递来的参数

  /**
   * callCloudFn 调用云函数方法需要参数
   * @param {object} ctx 上下文
   * @param {string} fnName 云函数名称
   * @param {object} params 传递给云函数的参数
   */

  const res = await callCloudFn(ctx, 'music', {
    $url: 'playlist',
    start: parseInt(query.start) || 0,
    count: parseInt(query.count) || 50
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

// 通过id查询单条歌单
router.get('/getById', async (ctx, next) => {
  // query写入数据库查询语句，其中 ctx.request.query.id 前端传来的id
  const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()` // db.collection('playlist')数据库集合，
   /**
   * callCloudDB 调用云数据库方法传入参数
   * @param {object} ctx 上下文
   * @param {string} fnName 接口的增删改查名称，增databaseadd、删databasedelete、改databaseupdate、查databasequery
   * @param {object} query 数据库操作语句
   */

  const res = await callCloudDB(ctx, 'databasequery', query)
  ctx.body = {
      code: 20000,
      data: JSON.parse(res.data)
  }
})

// 更新歌单
router.post('/updatePlaylist', async (ctx, next) => {
  const params = ctx.request.body // post请求获取前端传来的数据，需安装和配置koa-body
  const query = `
    db.collection('playlist').doc('${params._id}').update({
      data: {
        name: '${params.name}',
        copywriter: '${params.copywriter}'
      }
    })
  `
  const res = await callCloudDB(ctx, 'databaseupdate', query)
  ctx.body = {
      code: 20000,
      data: res
  }
})

// 删除歌单
router.get('/del', async (ctx, next) => {
  const params = ctx.request.query
  const query = `db.collection('playlist').doc('${params.id}').remove()`
  const res = await callCloudDB(ctx, 'databasedelete', query)
  ctx.body = {
    code: 20000,
    data: res
  }
})

module.exports = router