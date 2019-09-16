/**
 * 获取微信接口调用凭证
 * 详情：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
 */


const rp = require('request-promise') // node发送http请求的插件
const fs = require('fs') // node文件模块
const path = require('path') // node 路径模块

//fileName = __dirname 当前文件所在目录的绝对路径, 加上 './access_token.json'
const fileName = path.resolve(__dirname, './access_token.json')

// 这两个参数的获取：微信公众平台>开发>开发设置
const APPID = 'wxc4e0b2d98063b103'
const APPSECRET = '0d76e18e2165d3658e5603517bb410fd' //小程序密钥，注意保密!

// 微信 access_token 请求地址
const URL = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

// 发送请求获取AccessToken
const updateAccessToken = async () => {
  const resStr = await rp(URL)
  const res = JSON.parse(resStr)

  if (res.access_token) {
    // node写文件,参数：1 文件路径，2 文件内容, 首次写文件为新建，往后为覆盖
    fs.writeFileSync(fileName, JSON.stringify({
      access_token: res.access_token,
      createTime: new Date()
    }))
  } else { // 如获取不到，再次获取
    await updateAccessToken()
  }
}

// 读取access_token
const getAccessToken = async () => {
  try {
     // node读取文件,参数：1 读取的文件，2 字符集
    const readRes = fs.readFileSync(fileName, 'utf8')
    const readObj = JSON.parse(readRes)
    return readObj.access_token

  } catch (error) { //捕获异常，在未创建改文件时，先创建该文件
    await updateAccessToken()
    await getAccessToken()
  }
 
}
console.log(getAccessToken())