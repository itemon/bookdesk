//index.js
//获取应用实例
var app = getApp();
var envInfo = require('../../utils/debug').envInfo;
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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