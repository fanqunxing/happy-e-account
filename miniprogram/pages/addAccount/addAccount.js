var common = require("../../public/js/common.js");
var { formatDate } = common;
const app = getApp();

const db = wx.cloud.database({});
const db_account = db.collection('db_account');

Page({
  data: {
    id: '',
    isLook: false,
    today: formatDate(new Date()),
    accountMark: '',
    accountName: '',
    accountVal: 0,
    accountType: '1',
    accountTypeName: '餐饮',
    time: formatDate(new Date()),
    accountTypes: [],
    imgWidth: 690,
    imgHeight: 0,
    fileid: ''
  },

  setAccountTypeName() {
    var { accountType, accountTypes } = this.data;
    var obj = accountTypes.find(({ code }) => {
      return code == accountType;
    });
    console.log({ obj })
    if (obj) {
      var { name } = obj;
      this.setData({
        accountTypeName: name
      });
    }
  },

  onLoad(options) {
    var _this = this;
    this.getAccoutTypes(() => {
      var { look, id } = options;
      if (look == '1') {
        this.setData({
          isLook: true,
          id
        });
        db_account.doc(id).get({
          success: res => {
            var data = res.data;
            _this.setData({
              accountMark: data.accountMark,
              accountType: data.accountType,
              accountName: data.accountName,
              accountVal: data.accountVal,
              time: data.time,
              fileid: data.fileid || ''
            });
            _this.setAccountTypeName();
          }
        });
      }
    });

  },

  onShow() {

  },

  delClick() {
    wx.showModal({
      title: '提示',
      content: `您确定要删除吗？`,
      success: (sm) => {
        if (sm.confirm) {
          this.delAccount();
        }
      }
    });
  },

  delAccount() {
    var id = this.data.id;
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    wx.cloud.deleteFile({
      fileList: [this.data.fileid],
      success: res => {
      },
      fail: err => {
      }
    })
    table.doc(id).remove({
      success: (res) => {
        wx.showToast({
          title: '删除成功'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 300);
      },
    })
  },

  getAccoutTypes(fn) {
    const db = wx.cloud.database({});
    const table = db.collection('db_accountType');
    table.get({
      success: (res) => {
        var { data } = res;
        this.setData({
          accountTypes: data
        });
        fn && fn()
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
    const { accountVal } = this.data;
    var bflag = true;
    var msg = '';
    do {
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

  imageLoad(e) {
    var { height, width } = e.detail;
    var imgHeight = height * this.data.imgWidth / width;
    this.setData({
      imgHeight
    });
  },

  selectImg() {
    var openid = app.globalData.openid;
    var time = this.data.time;
    wx.chooseImage({
      sizeType: ['compressed'],
      success: chooseResult => {
        wx.cloud.uploadFile({
          cloudPath: `${openid}/${time}/${Date.now()}.png`,
          filePath: chooseResult.tempFilePaths[0],
          success: res => {
            this.setData({
              fileid: res.fileID
            });
          },
          fail: e => {
            console.log(e);
          }
        })
      }
    });
  },

  sure() {
    var ischeck = this.checkVail();
    if (!ischeck) return;
    var { accountName, accountVal, accountMark, accountType, time, accountTypeName, fileid } = this.data;
    const db = wx.cloud.database({});
    const table = db.collection('db_account');
    if (!accountName) {
      accountName = accountTypeName;
    }
    table.add({
      data: {
        accountMark,
        accountType,
        accountName,
        accountVal,
        time,
        fileid
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