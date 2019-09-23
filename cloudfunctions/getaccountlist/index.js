const cloud = require('wx-server-sdk')
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database({});
const db_account = db.collection('db_account');


exports.main = async (event, context) => {
  //event.a + event.b  event 是请求方法
  const { OPENID } = cloud.getWXContext()
  return db_account.where({
    _openid: OPENID
  }).get();
}