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

  sure() {
    const { accountName, accountVal } = this.data;
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    table.add({
      data: {
        accountName,
        accountVal
      },
      success: function (res) {
        console.log(res._id)
      }
    });
    wx.navigateBack();
    this.setData({
      accountName: '',
      accountVal: 0
    });
  }
})