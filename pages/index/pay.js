
const {getUrl, APIs} = require('./../../conf/apis.js')

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

const booking = (wx, opts) => {
  const bookingUrl = getUrl(APIs.booking);
  console.log('start to call booking api ', bookingUrl);
  let payload = {
    ...opts,
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: bookingUrl,
      data: payload,
      method: 'POST',
      success: function (res) {
        console.log(res);
        reject({ msg: 'not implemented yet' });
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

const callClientToPay = (wx, opts) => {
  const {timeStamp, nonceStr, prepay_id, signType, paySign} = opts;

  if (!prepay_id) {
    return Promise.reject('prepay_id is required');
  }

  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: prepay_id,
      signType: signType,
      paySign: paySign,
      success: function (res) {
        console.log(res);
        resolve(res);
      },
      fail: function (err) {
        console.error(err);
        reject(err);
      }
    });
  });
}

module.exports.pay = pay;
module.exports.requestOpenId = requestOpenId;
module.exports.booking = booking;
module.exports.checkout = callClientToPay;