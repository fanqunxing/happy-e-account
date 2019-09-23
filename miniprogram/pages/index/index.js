//index.js
const app = getApp()
var { getMonthAndDay } = require("../../public/js/common.js");
Page({
  data: {
    isAdmin: false,
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    accountList: [],
    totalAccount: 0
  },

  getAllAccoutList() {
    if (!app.globalData.openid) {
      this.onGetOpenid(this.getAllAccout);
    } else {
      this.getAllAccout();
    }
  },

  getAllAccout() {
    const _this = this;
    wx.cloud.callFunction({
      name: 'getaccountlist',
      data: {},
      complete: respsonse => {
        var res = respsonse.result;
        var { data } = res;
        data = data.reverse();
        if (Array.isArray(data)) {
          var totalAccount = 0;
          data.forEach((item) => {
            var { accountVal, time } = item;
            item.time = getMonthAndDay(time);
            totalAccount += Number(accountVal);
          });
          _this.setData({
            totalAccount
          })
        }

        _this.setData({
          accountList: data
        });
      }
    });
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
    this.getAllAccoutList();
  },

  // 设置openid
  onGetOpenid: function (fn) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid;
        if (res.result.openid === "oDs3N4oTf9m4KL8ozMp8iNZj6-zA") {
          this.setData({
            isAdmin: true
          });
        }
        fn && fn();
      },
      fail: err => {
      }
    })
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

    this.onGetOpenid();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.navigateTo({
            url: '../authorize/authorize'
          })
        } else {
          wx.getUserInfo({
            success: (res) => {
              var { userInfo } = res;
              this.setData({
                logged: true,
                avatarUrl: userInfo.avatarUrl,
                userInfo: userInfo
              });
              app.globalData.userInfo = userInfo;
              this.getAllAccoutList();
            }
          })
        }
      }
    })
  },

  // 跳转记账页面
  addAccount() {
    wx.navigateTo({
      url: '../addAccount/addAccount'
    })
  },

  delClick(event) {
    var accountName = event.target.dataset.accountname;
    var id = event.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: `您确定要删除"${accountName}"吗？`,
      success: (sm) => {
        if (sm.confirm) {
          this.delAccount(id);
        }
      }
    });
  },

  delAccount(id) {
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    table.doc(id).remove({
      success: (res) => {
        this.getAllAccoutList();
        wx.showToast({
          title: '删除成功'
        });
      }
    })
  }

})
