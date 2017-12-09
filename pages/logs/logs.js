//logs.js
var util = require('../../utils/util.js')
Page({
  data: {
    logs: []
  },
  onShareAppMessage: function() {
    return {
      title: "就餐预定",
      path: "pages/index/index?utm_source=log"
    }
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(function (log) {
        return util.formatTime(new Date(log))
      })
    })
  }
})
