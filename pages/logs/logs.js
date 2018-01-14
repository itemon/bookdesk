//logs.js
var util = require('../../utils/util.js');
const {pay, requestOpenId} = require('./../index/pay.js');
const {getOrders} = require('./order_utils.js');
Page({
  data: {
    logs: []
  },
  toDate () {
    return '111';
  },
  bindItem (evt) {
    const id = evt.currentTarget.dataset.id;
    console.log(evt, id);
    wx.navigateTo({
      url: '/pages/order/order?id='+id,
    });
  },
  onShareAppMessage: function() {
    return {
      title: "就餐预定",
      path: "pages/index/index?utm_source=log"
    }
  },
  onLoad: function () {
    /*this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })*/
    wx.showLoading({
      title: '请稍候...',
    });
    pay(wx)
      .then((res) => {
        return requestOpenId(wx, {
          js_code: res.code
        });
      })
      .then((res) => {
        console.log(res);
        return getOrders(wx, {open_id: res.openid});
      })
      .then(res => {
        console.log(res);
        wx.hideLoading();
        res = res.map (i => {
          i.create_time = new Date(i.create_time * 1000).toLocaleDateString();
          return i;
        });

        // res = [];
        // res.length = 4;
        // res = res.fill(res[0], 1, 5);

        this.setData({
          logs: res
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: '获取预定历史失败',
        });
      });    
  }
})
