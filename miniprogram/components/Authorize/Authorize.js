// components/component.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    innerText: {
      type: String,
      value: 'hello world'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取登录权限
    onGetUserInfo(e) {
      var userInfo = e.detail.userInfo;
      console.log(userInfo);
      this.triggerEvent('onGetUserInfo', userInfo);
      // if (userInfo) {
      //   this.setData({
      //     logged: true,
      //     avatarUrl: userInfo.avatarUrl,
      //     userInfo: userInfo
      //   });
      //   app.globalData.myUserInfo = userInfo;
      // }
    }
  }
});
