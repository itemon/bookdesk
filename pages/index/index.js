//index.js
//获取应用实例
var app = getApp();
var envInfo = require('../../utils/debug').envInfo;
var {toDateString, toDateRange} = require('./date_utils');
var [begin, end] = toDateRange();
var {pay, requestOpenId, booking, checkout} = require('./pay.js');
var {appConf} = require('../../conf/app_conf.js');
var { loginBefore, setSessionKeyAndOpenId } = require('./login_utils.js');

Page({
  data: {
    userInfo: {},
    hc: [2, 4, 6, 8, 10].map((v) => v + '个人以内'),
    hcCheckedIndex: 0,
    checkedDate: toDateString(begin),
    startDate: toDateString(begin),
    endDate: toDateString(end),
    paying: false,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindPCChange: function(evt) {
    const {detail: {value}} = evt;
    this.setData({
      "hcCheckedIndex":parseInt(value)
    });
  },
  bindDateChange: function (evt) {
    const { detail: { value } } = evt;
    this.setData({
      checkedDate: value
    });
  },
  booking (res) {
    let bookingRequirements = {
      ...res,
      gender: 0,
      eat_date: '2018-01-10',
      eat_mement: 0,
      eat_count: 2,
      taboos: '不吃辣',
      phone: '18618387281',
    }
    booking(wx, bookingRequirements)
    .then(res => {
      this.setData({ paying: false });
      wx.hideLoading();
      let allSignArgs = {
        ...res,
      }
      return checkout(wx, allSignArgs);
    })
    .then (res => {
      console.log(res);
    })
    .catch(err => {
      this.setData({ paying: false });
      wx.hideLoading();
      wx.showToast({
        title: err.msg,
      });
    });
  },
  onStartPay: function () {
    this.setData({
      paying: true
    });
    wx.showLoading({
      title: '加载中，请稍候...',
    });

    loginBefore(wx)
    .then((res) => {
      console.log(res.data);
      this.booking(res.data);
    }).catch((res) => {
      this.onReallyStartPay();
    });
  },
  onReallyStartPay () {
    pay(wx)
    .then((res) => {
      return requestOpenId(wx, {
        appid: appConf.appid,
        secret: appConf.secret,
        js_code: res.code
      });
    })
    .then((res) => {
      setSessionKeyAndOpenId(wx, res);
      this.booking(res);
    })
    .catch((err) => {
      console.log(err);
      this.setData({ paying: false });
    });
  },
  onShareAppMessage: function (options) {
    console.log(options);
  },
  onLoad: function () {
    envInfo(wx);
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
