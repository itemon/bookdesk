
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
  // console.log('start to call booking api ', bookingUrl);
  // return Promise.reject({errMsg: 'not implemented'});
  let payload = {
    ...opts,
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: bookingUrl,
      data: payload,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        // console.log(res);
        // reject({ msg: 'not implemented yet' });
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (res.data.code == 0) {
            resolve(JSON.parse(res.data.jsApiParameters));
          } else {
            reject({ errMsg: res.data.message});
          }
        } else {
          reject({errMsg:'can not connecte to server'});
        }
        // resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

const callClientToPay = (wx, opts) => {
  const {timeStamp, nonceStr, signType, paySign} = opts;

  if (!opts['package']) {
    return Promise.reject({ errMsg: 'package is required'});
  }

  return new Promise((resolve, reject) => {
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: opts['package'],
      signType: signType,
      paySign: paySign,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

module.exports.pay = pay;
module.exports.requestOpenId = requestOpenId;
module.exports.booking = booking;
module.exports.checkout = callClientToPay;