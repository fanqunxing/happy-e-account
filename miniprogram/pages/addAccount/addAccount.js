var common = require("../../public/js/common.js");
var { formatDate } = common;

Page({
  data: {
    today: formatDate(new Date()),
    accountMark: '',
    accountName: '',
    accountVal: 0,
    accountType: '99',
    accountTypeName: '其他',
    time: formatDate(new Date()),
    accountTypes: []
  },

  onShow() {
    this.getAccoutTypes();
  },

  getAccoutTypes() {
    const db = wx.cloud.database({});
    const table = db.collection('db_accountType');
    table.get({
      success: (res) => {
        var { data } = res; 
        this.setData({
          accountTypes: data
        })
      }
    })
  },

  bindPickerChange(event) {
    var val = event.detail.value;
    var { code, name } = this.data.accountTypes[val];
    this.setData({
      accountType: code,
      accountTypeName: name
    })
  },

  bindDateChange(event) {
    var val = event.detail.value;
    this.setData({
      time: val
    })
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

  nameInput(event) {
    const accountName = event.detail.value;
    this.setData({
      accountName
    });
  },

  markInput(event) {
    const accountMark = event.detail.value;
    this.setData({
      accountMark
    });
  },


  timeInput(event) {
    const time = event.detail.value;
    this.setData({
      time
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
    const { accountName, accountVal, accountMark, accountType, time } = this.data;
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    table.add({
      data: {
        accountMark,
        accountType,
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