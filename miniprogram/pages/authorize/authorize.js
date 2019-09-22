const app = getApp();

Page({
  onGetUserInfo(e) {
    var userInfo = e.detail.userInfo;
    console.log(userInfo);
    if (userInfo) {
      app.globalData.myUserInfo = userInfo;
      wx.navigateBack();
    }
  }
})