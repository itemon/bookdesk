//index.js
//获取应用实例
var app = getApp();
var envInfo = require('../../utils/debug').envInfo;
var {toDateString, toDateRange} = require('./date_utils');
var [begin, end] = toDateRange();
var { pay, requestOpenId, booking, checkout } = require('./pay.js');
var { appConf } = require('../../conf/app_conf.js');
var { loginBefore, setSessionKeyAndOpenId } = require('./login_utils.js');
var { allRequirements, checkReq } = require('./booking_req.js');

const HEAD_COUNT_BASE = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

Page({
  data: {
    userInfo: {},
    tags: [],
    hc: HEAD_COUNT_BASE.map((item, idx) => {
      return (idx == HEAD_COUNT_BASE.length - 1) ? item + '人以内' : item + '人';
    }),
    hcBase: HEAD_COUNT_BASE,
    hcCheckedIndex: 0,
    checkedDate: toDateString(begin),
    startDate: toDateString(begin),
    endDate: toDateString(end),
    gender: 1,
    name: '',
    phone: '',
    taboos: '',
    eat_mement: 1,
    paying: false,
    currentOrderId: ''
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
  bindText: function (evt) {
    const { detail: { value } } = evt;
    const name = evt.currentTarget.dataset.name;
    if (typeof name === 'string') {
      switch(name) {
        case 'name':
        case 'phone':
        case 'taboos':
          this.setData({
            [name]: value
          });
          break;
      }
    }
  },
  bindDateChange: function (evt) {
    const { detail: { value } } = evt;
    this.setData({
      checkedDate: value
    });
  },
  bindSelectGender: function (evt) {
    const { detail: { value } } = evt;
    this.setData({
      gender: Number(value),
    })
  },
  bindSelectTime: function (evt) {
    const { detail: { value } } = evt;
    this.setData({
      eat_mement: Number(value),
    })
  },
  bindAddTag (evt) {
    console.log(evt);
    const { currentTarget: { dataset } } = evt;
    const { text } = dataset;
    this.setData({
      taboos: this.data.taboos + (this.data.taboos.length > 0 ? ", " : "") + text
    })
  },
  bindPolicyClick () {
    wx.showModal({
      title: '预定须知',
      content: `首先欢迎您光顾Mokutanya餐厅,
      由于Mokutanya所用食材均为新鲜采购,
      请您确定好时间与用餐人数后提前三天预约,
      我们会收取您 500元/位 的定金,
      定金到账后，我们会为您保留包间并准备食材,
      支付定金时请填写清楚您的预约信息,
      若有失误，定金不到账，则预定作废,
      请务必在预定时及时支付定金,
      若超出指定时间，则预定作废,
      为确保您预定成功我们会在您支付定金后,
      24小时打电话或发短信确认,
      用餐时我们会以预定手机发送的确定短信为准,
      定金支付后不可以任何理由更改人数、改期或退款,
      请您预定前三思，如果取消预定，请谅解定金恕不退还`,
      showCancel: false
    });
  },
  booking (res) {
    let reqs = allRequirements(this);
    let bookingRequirements = {
      ...reqs,
      open_id: res.openid,
      // gender: 0,
      // eat_mement: 0,
    }

    if (!checkReq(wx, bookingRequirements)) {
      this.setData({ paying: false });
      return;
    }

    booking(wx, bookingRequirements)
    .then(res => {
      this.setData({ paying: false });
      wx.hideLoading();
      let allSignArgs = {
        ...res,
      }

      const { order_id } = allSignArgs;
      console.log('the order id just created is ', order_id);
      this.setData({
        currentOrderId: order_id
      });

      return checkout(wx, allSignArgs);
    })
    .then (res => {
      console.log(res);
      wx.showToast({
        title: '订餐成功，用餐愉快',
      });
      wx.navigateTo({
        url: '/pages/order/order?id=' + this.data.currentOrderId,
      });
    })
    .catch(err => {
      this.setData({ paying: false });
      wx.hideLoading();
      if (err.code === 3) {
        wx.showModal({
          title: '订满了',
          showCancel: false,
          content: '您所选的时间段已经满座了，非常的抱歉，您可以选择其他时间段预定',
        });
        return;
      }
      wx.showToast({
        title: err.errMsg,
        image: '../../resource/close.png'
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
        // appid: appConf.appid,
        // secret: appConf.secret,
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
    return {
      title: appConf.shareTitle,
      path: appConf.sharePage + "index"
    }
  },
  onLoad: function () {
    envInfo(wx);
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo) => {
      //更新数据
      that.setData({
        userInfo:userInfo
      })
      const {gender, nickName} = userInfo;
      this.setData({
        gender: gender,
        name: nickName,
      })
    })
  }
})
