
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
  const {js_code} = opts;
  if (!js_code) {
    return Promise.reject("js_code param required");
  }
  const payload = {
    js_code: js_code
  }
  const openIdUrl = getUrl(APIs.openid);
  return new Promise ((resolve, reject) => {
    wx.request({
      method: 'GET',
      url: openIdUrl,
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
          // res.data.code = 3;
          if (res.data.code == 0) {
            let payParams = JSON.parse(res.data.jsApiParameters);
            payParams.order_id = res.data.order_id;
            resolve(payParams);
          } else {
            reject({ errMsg: res.data.message, code: res.data.code });
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