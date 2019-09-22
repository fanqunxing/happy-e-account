
const app = getApp();
var db = wx.cloud.database({});
const db_home = db.collection('db_home');

Page({

  onLoad() {
    this.getAllHome();
  },

  getAllHome() {
    db_home.get({
      success: res => {
        var { data } = res;
        console.log(data);
      }
    })
  },

  addHome() {
    var { openid, userInfo } = app.globalData;
    var { nickName } = userInfo;
    db_home.add({
      data: {
        homeName: '快乐家园',
        creater: nickName,
        createrID: openid,
        member: []
      },
      success: () => {

      }
    })
  }
});