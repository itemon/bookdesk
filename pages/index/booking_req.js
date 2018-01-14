
const {checkPhone} = require('../../utils/validator.js');

const allRequirements = (page) => {
  return {
    eat_date: page.data.checkedDate,
    eat_count: page.data.hcBase[page.data.hcCheckedIndex],
    gender: page.data.gender,
    taboos: page.data.taboos,
    name: page.data.name,
    phone: page.data.phone,
    eat_mement: page.data.eat_mement,
  }
}

const checkReq = (wx, all) => {
  if (!all.name || all.name.length == 0) {
    wx.showToast({
      title: '姓名需要填写',
      image: '../../resource/close.png'
    });
    return false;
  } else if (!all.phone || all.phone.length == 0 || !checkPhone(all.phone)) {
    wx.showToast({
      title: '手机号格式不对',
      image: '../../resource/close.png'
    });
    return false;
  }
  return true;
}

module.exports.allRequirements = allRequirements;
module.exports.checkReq = checkReq;