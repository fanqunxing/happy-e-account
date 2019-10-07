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
    currentMonthAccount: 0,
    isShowAuthorize: false,
    blackboard: '学问勤中得, 富裕俭中来'
  },

  isCurrentMonth(time) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const last = new Date(time);
    const lastYear = last.getFullYear();
    const lastMonth = last.getMonth();

    if (year == lastYear && month == lastMonth) {
      return true;
    }
    return false;
  },

  getAllAccout() {
    API.getaccountlist({
      data: {}
    })
      .then(res => {
        // console.log(res);
        var data = JSON.parse(JSON.stringify(res)).reverse();
        if (Array.isArray(data)) {
          var totalAccount = 0;
          var currentMonthAccount = 0;
          data.forEach((item) => {
            var { accountVal, time } = item;
            item.time = getMonthAndDay(time);
            if (this.isCurrentMonth(time)) {
              currentMonthAccount += Number(accountVal);
            };
            totalAccount += Number(accountVal);
          });
          this.setData({
            totalAccount: totalAccount.toFixed(1),
            currentMonthAccount: currentMonthAccount.toFixed(1)
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
    API.getBlackboard().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        console.log(data[0].content);
        this.setData({
          blackboard: data[0].content
        })
      }
    });
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
