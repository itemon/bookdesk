//index.js
//获取应用实例
var app = getApp();
var envInfo = require('../../utils/debug').envInfo;
var {toDateString, toDateRange} = require('./date_utils');
var [begin, end] = toDateRange();

Page({
  data: {
    userInfo: {},
    hc: [1, 2, 3, 4, 5].map((v) => v + '个人就餐'),
    hcCheckedIndex: 0,
    checkedDate: toDateString(begin),
    startDate: toDateString(begin),
    endDate: toDateString(end)
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
