
var http = require('./http/index.js');

var api = {};
const title = '加载中';
for (var key in http) {
  const promise = http[key];
  api[key] = (params = {}) => {
    var { data } = params;
    wx.showLoading({ title });
    return new Promise((resolve, reject) => {
      promise(data).then(res => {
        wx.hideLoading();
        resolve(res);
      }).catch(e => {
        wx.hideLoading();
        reject(e);
      });
    })
  };
}

console.log(api);
module.exports = api