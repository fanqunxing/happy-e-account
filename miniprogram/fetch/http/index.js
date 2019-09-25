
const db = wx.cloud.database({});
const db_account = db.collection('db_account');
const db_accountType = db.collection('db_accountType');

// 获取记账信息列表
function getaccountlist(data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'getaccountlist',
      data,
      complete: res => {
        resolve(res.result.data);
      },
      fail: error => {
        reject(error);
      }
    });
  });
}

// 登录
function login(data) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      ...data,
      success: res => {
        resolve(res.result);
      },
      fail: error => {
        reject(error);
      }
    })
  });
}


function getSetting() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    })
  });
}


function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    });
  });
}

function getAccountById(data = {}) {
  var { id } = data;
  return new Promise((resolve, reject) => {
    db_account.doc(id).get({
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    });
  });
}

function getAccoutTypes() {
  return new Promise((resolve, reject) => {
    db_accountType.get({
      success: (res) => {
        resolve(res.data);
      },
      fail: error => {
        reject(error);
      }
    })
  });
}

function uploadFile(data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      ...data,
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    })
  });
}

function deleteFile(data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.deleteFile({
      ...data,
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    })
  });
}


function chooseImage(data = {}) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      ...data,
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    });
  });
}

function addAccout(data = {}) {
  return new Promise((resolve, reject) => {
    db_account.add({
      data,
      success: res => {
        resolve(res);
      },
      fail: error => {
        reject(error);
      }
    });
  });
}

function deleteAccoutById(data = {}) {
  var { id } = data;
  return new Promise((resolve, reject) => {
    db_account.doc(id).remove({
      success: res => {
        resolve(res)
      },
      fail: error => {
        reject(error);
      }
    })
  });
}

module.exports = {
  getaccountlist,
  getSetting,
  getUserInfo,
  getAccountById,
  getAccoutTypes,
  uploadFile,
  chooseImage,
  addAccout,
  deleteFile,
  deleteAccoutById,
  login
}