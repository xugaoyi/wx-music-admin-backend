const rp = require('request-promise') // node环境发送http请求的模块
const getAccessToken = require('./getAccessToken') // 微信接口调用凭证
const fs = require('fs') // node文件模块

const callCloudStorage = {
  // 调用云存储API，详见：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/batchDownloadFile.html

  /**
   * callCloudStorage.download() 调用云存储下载方法
   * @param {object} ctx 上下文，ctx.state.env云开发环境ID
   * @param {Array.<Object>} fileList 文件列表
   */

  // 获取文件链接
  async download(ctx, fileList) {
    const ACCESS_TOKEN = await getAccessToken() // 获取微信接口调用凭证

    // uri的链接为操作云数据库的接口，只能post方式请求
    const options = { // request-promise发送post请求的配置
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
      body: { // 传入参数
        env: ctx.state.env, // 云环境ID
        file_list: fileList
      },
      json: true // 自动将字符串转为JSON格式
    }
    // 发送请求，并返回数据
    return await rp(options).then((res) => {
      return res
    }).catch((err) => {
      console.log(err) // 中间件中所有console.log都在终端打印
    })
  },



  // 上传文件到云存储，API详见：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/uploadFile.html
  async upload(ctx) {
    // 步骤1, 请求地址

    const ACCESS_TOKEN = await getAccessToken() // 获取微信接口调用凭证
    const file = ctx.request.files.file // ctx.request.files.file前端提交上来的图片对象

    const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`  // 构建文件路径

    const options = { // request-promise发送post请求的配置
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
      body: { // 传入参数
        path,
        env: ctx.state.env, // 云环境ID
      },
      json: true
    }
    // 发送请求
    const info = await rp(options).then((res) => {
      return res
    }).catch((err) => {
      console.log(err) // 中间件中所有console.log都在终端打印
    })

    //步骤2, 上传图片。到这里并没有上传到云存储，还需再发送一个HTTP POST请求
    const params = {
      method: 'POST',
      headers: {
        'content-type': 'multipart/form-data'
      },
      uri: info.url,
      formData: {
        key: path,
        Signature: info.authorization,
        'x-cos-security-token': info.token, // 字段包含横杠，需改成字符串
        'x-cos-meta-fileid': info.cos_file_id,
        file: fs.createReadStream(file.path) // 转成二进制
      },
      json: true
    }
    await rp(params) // 这里没有返回值

    return info.file_id
  },

  // 删除云文件，API详见：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/reference-http-api/storage/batchDeleteFile.html
  async delete(ctx, fileid_list) {
    const ACCESS_TOKEN = await getAccessToken() // 获取微信接口调用凭证

    const options = { // request-promise发送post请求的配置
      method: 'POST',
      uri: `https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
      body: { // 传入参数
        fileid_list,
        env: ctx.state.env // 云环境ID
      },
      json: true
    }
    // 发送请求，并返回数据
    return await rp(options).then((res) => {
      return res
    }).catch((err) => {
      console.log(err)
    })

  }
}
module.exports = callCloudStorage
