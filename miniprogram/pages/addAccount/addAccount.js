function formatDate(now) {
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

Page({
  data: {
    accountName: '',
    accountVal: 0
  },

  cancel() {
    this.setData({
      accountName: '',
      accountVal: 0
    });
    wx.navigateBack();
  },

  addInput(event) {
    const accountVal = event.detail.value;
    this.setData({
      accountVal
    });
  },

  markInput(event) {
    const accountName = event.detail.value;
    this.setData({
      accountName
    });
  },

  checkVail() {
    var reg = /^[0-9]+.?[0-9]*$/;
    const { accountName, accountVal } = this.data;
    var bflag = true;
    var msg = '';
    do {
      if (!accountName) {
        bflag = false;
        msg = '请填写备注名称';
        break;
      }
      if (!accountVal) {
        bflag = false;
        msg = '请填写消费金额';
        break;
      }
      if (!reg.test(accountVal)) {
        bflag = false;
        msg = '消费金额请填写数字';
        break;
      }
    } while (false);
    if (msg) {
      wx.showToast({
        icon: 'none',
        title: msg
      });
    }
    return bflag;
  },

  sure() {
    var ischeck = this.checkVail();
    if (!ischeck) return;
    const { accountName, accountVal } = this.data;
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    var time = formatDate(new Date());
    table.add({
      data: {
        accountName,
        accountVal,
        time
      },
      success: res => {
        wx.navigateBack();
        this.setData({
          accountName: '',
          accountVal: 0
        });
      }
    });

  }
})