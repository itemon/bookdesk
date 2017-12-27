
const pay = (wx) => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        console.log(res);
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

const requestOpenId = (wx, opts) => {
  const {appid, secret, js_code} = opts;
  if (!appid || !secret || !js_code) {
    return Promise.reject("appid, secret, js_code param required");
  }
  const payload = {
    appid,
    secret,
    js_code,
    grant_type: 'authorization_code'
  }
  return new Promise ((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: payload,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

module.exports.pay = pay;
module.exports.requestOpenId = requestOpenId;