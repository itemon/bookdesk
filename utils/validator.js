
const regexpPhone = /^1(3|4|5|7|8)\d{9}$/gi;

const checkPhone = (phone) => {
  regexpPhone.lastIndex = 0;
  return regexpPhone.test(phone);
}

module.exports.checkPhone = checkPhone;