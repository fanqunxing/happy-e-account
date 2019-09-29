//index.js
const app = getApp()
var { getMonthAndDay } = require("../../public/js/common.js");
var API = require('../../fetch/index.js');

Page({
  data: {
    isAdmin: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    accountList: [],
    totalAccount: 0,
    isShowAuthorize: false
  },

  getAllAccout() {
    API.getaccountlist({
      data: {}
    })
      .then(data => {
        data = data.reverse();
        if (Array.isArray(data)) {
          var totalAccount = 0;
          data.forEach((item) => {
            var { accountVal, time } = item;
            item.time = getMonthAndDay(time);
            totalAccount += Number(accountVal);
          });
          this.setData({
            totalAccount: totalAccount.toFixed(1)
          })
        }
        this.setData({
          accountList: data
        });
      })
  },

  onShow() {
    var myUserInfo = app.globalData.myUserInfo;
    if (myUserInfo) {
      var avatarUrl = this.data.avatarUrl;
      this.setData({
        logged: true,
        userInfo: myUserInfo,
        avatarUrl: myUserInfo.avatarUrl || avatarUrl
      });
    }
    // 返回刷新，这个是必要的
    this.getAllAccout();
  },

  goMyHome() {
    wx.navigateTo({
      url: '../home/home'
    })
  },

  lookClick(event) {
    var id = event.target.dataset.id;
    wx.navigateTo({
      url: '../addAccount/addAccount?look=1&id=' + id
    })
  },

  onLoad: function () {
    API.getSetting().then(res => {
      // 此时为未鉴权的用户
      if (res.authSetting['scope.userInfo']) {
        // 已经鉴权的用户可以登录并获取openid
        this.tologin()
          .then(() => {
            this.getAllAccout();
          });
      }
    })
  },

  bindSendMsg: function (e) {
    var formId = e.detail.formId;
    console.log({formId});
    API.sendmsg({
      data: {
        formId
      }
    }).then(data => {
      console.log(data);
    })
    // wx.request({
    //   url: 'https://.../sendMsg',
    //   data: {
    //     formId: formId,
    //     openid: openid,
    //     type: type
    //   },
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   success(res) {
    //     console.log("sendMsg result", res.data)
    //   }
    // })
  },

  tologin() {
    return new Promise((resolve, reject) => {
      API.login({})
        .then(({ openid }) => {
          app.globalData.openid = openid;
          return API.getUserInfo();
        })
        .then(res => {
          var { userInfo } = res;
          this.setData({
            logged: true,
            avatarUrl: userInfo.avatarUrl,
            userInfo: userInfo
          });
          app.globalData.userInfo = userInfo;
          resolve();
        })
        .catch(e => {
          reject(e);
        });
    })

  },

  // 跳转记账页面
  addAccount() {
    if (!app.globalData.openid) {
      this.setData({
        isShowAuthorize: true
      });
    } else {
      wx.navigateTo({
        url: '../addAccount/addAccount'
      })
    }
  },

  // 获取登录权限
  onGetUserInfo(e) {
    var userInfo = e.detail;
    if (userInfo) {
      this.setData({
        logged: true,
        avatarUrl: userInfo.avatarUrl,
        userInfo: userInfo
      });
      app.globalData.myUserInfo = userInfo;
      this.setData({
        isShowAuthorize: false
      });
    }
    this.tologin()
      .then(() => {
        wx.navigateTo({
          url: '../addAccount/addAccount'
        });
      });
  }

})
