// pages/order.js
const { pay, requestOpenId } = require('./../index/pay.js');
const { getOrder } = require('./../logs/order_utils.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    orderStatus: ['', '未支付', '支付完成'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const {id} = options;
    if (id) {
      console.log('id is ', id);
    }

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
        return getOrder(wx, { open_id: res.openid, order_id: id });
      })
      .then(res => {
        console.log(res);
        wx.hideLoading();

        let create_time = res.create_time * 1000;
        let create_date = new Date(create_time);
        res.create_time = create_date.toLocaleDateString() + ' ' + create_date.toLocaleTimeString();

        this.setData({
          order: res
        });
      })
      .catch((err) => {
        wx.hideLoading();
        wx.showToast({
          title: '获取订单失败',
          image: '../../resource/close.png'
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
  
  }
})