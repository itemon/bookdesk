const { getUrl, APIs } = require('./../../conf/apis.js');

const getOrders = (wx, opts) => {
  const {open_id} = opts;
  if (!open_id) {
    return Promise.reject({errMsg: 'open_id缺少'});
  }

  const payload = {
    open_id: open_id
  }

  return new Promise ((resolve, reject) => {
    wx.request({
      url: getUrl(APIs.orders),
      data: payload,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        const {code} = res.data;
        if (typeof code == 'undefined' || code != 0) {
          reject({errMsg: '请求失败'});
        } else {
          resolve(res.data.order_list);
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}

const getOrder = (wx, opts) => {
  const { open_id, order_id } = opts;
  if (!open_id) {
    return Promise.reject({ errMsg: 'open_id缺少' });
  }

  const payload = {
    open_id: open_id,
    order_id
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(APIs.order_item),
      data: payload,
      method: 'GET',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      success: function (res) {
        let { code } = res.data;
        // code = 0;
        if (typeof code == 'undefined' || code != 0) {
          reject({ errMsg: '请求失败' });
        } else {
          resolve(res.data.detail);
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  });
}


module.exports.getOrders = getOrders;
module.exports.getOrder = getOrder;