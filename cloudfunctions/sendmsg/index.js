const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
      page: 'pages/index/index',
      data: {
        keyword1: {
          value: '339208499'
        },
        keyword2: {
          value: '2015年01月05日 12:30'
        },
        keyword3: {
          value: '腾讯微信总部'
        },
        keyword4: {
          value: '广州市海珠区新港中路397号'
        }
      },
      templateId: '1VLH5I6eaOnhuFFlvCDT5m_XNF7rbSFWqVrv7DXBh6g', //AT2165
      formId: event.formId,
      emphasisKeyword: 'keyword1.DATA'
    })
    // result 结构
    // { errCode: 0, errMsg: 'openapi.templateMessage.send:ok' }
    return result
    // return 'success';
  } catch (err) {
    // 错误处理
    // err.errCode !== 0
    throw err
  }
}