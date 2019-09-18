const rp = require('request-promise') // node环境发送http请求的模块
const getAccessToken = require('./getAccessToken') // 微信接口调用凭证

/**
 * callCloudFn 调用云函数方法
 * @param {object} ctx 上下文，ctx.state.env云开发环境ID
 * @param {string} fnName 云函数名称
 * @param {object} params 传递给云函数的参数
 */
const callCloudFn = async (ctx, fnName, params) => {
    // HTTP API调用云函数，详见：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/functions/invokeCloudFunction.html
 
    const ACCESS_TOKEN = await getAccessToken() // 获取微信接口调用凭证

    // uri的链接为调用云函数的http接口，只能post方式请求
    const options = { // request-promise发送post请求的配置
        method: 'POST',
        uri: `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${ACCESS_TOKEN}&env=${ctx.state.env}&name=${fnName}`,
        body: { // 云函数端需要的参数
            ...params
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

module.exports = callCloudFn