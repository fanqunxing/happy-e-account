//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    accountList: [],
    totalAccount: 0
  },

  getAllAccoutList() {
    const _this = this;
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    table.where({
      _openid: app.globalData.openid,
    }).get({
      success(res) {
        const { data } = res;
        if (Array.isArray(data)) {
          var totalAccount = 0;
          data.forEach(({ accountVal }) => {
            totalAccount += Number(accountVal);
          });
          _this.setData({
            totalAccount
          })
        }

        _this.setData({
          accountList: data
        })
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

  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
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
    const id = event.target.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
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
