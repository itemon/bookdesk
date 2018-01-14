// pages/my/my.js
var app = getApp();
var { appConf } = require('./../../conf/app_conf.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },

  bindCall () {
    wx.makePhoneCall({
      phoneNumber: '400-166-7999',
    });
  },

  bindAbout () {
    wx.showModal({
      title: '关于MOKUTANYA',
      content: '我们是MOKUTANYMOKUTANYMOKUTANYMOKUTANYMOKUTANYMOKUTANYMOKUTANYMOKUTANY',
      showCancel: false,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getUserInfo((userInfo) => {
      //更新数据
      this.setData({
        userInfo: userInfo
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: appConf.shareTitle,
      path: appConf.sharePage + "my"
    }
  }
})