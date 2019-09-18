const rp = require('request-promise') // node环境发送http请求的模块
const getAccessToken = require('./getAccessToken') // 微信接口调用凭证

/**
 * callCloudDB 调用云数据库方法
 * @param {object} ctx 上下文，ctx.state.env云开发环境ID
 * @param {string} fnName 接口的增删改查名称，增databaseadd、删databasedelete、改databaseupdate、查databasequery
 * @param {object} query 数据库操作语句
 */
const callCloudDB = async (ctx, fnName, query = {}) => {
  // 操作云数据库API，详见：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/database/databaseQuery.html
  
  const ACCESS_TOKEN = await getAccessToken() // 获取微信接口调用凭证

  // uri的链接为操作云数据库的接口，只能post方式请求
  const options = { // request-promise发送post请求的配置
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/${fnName}?access_token=${ACCESS_TOKEN}`,
      body: {
          query, // 数据库操作语句
          env: ctx.state.env // 云环境ID
      },
      json: true // 自动将字符串转为JSON格式
  }

   // 发送请求，并返回数据
   return await rp(options).then((res) => {
        return res
    }).catch((err) => {
      console.log(err) // 中间件中所有console.log都在终端打印
    })
}

module.exports = callCloudDB