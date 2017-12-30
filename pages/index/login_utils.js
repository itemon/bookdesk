const loginBefore = (wx) => {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: function () {
        console.log('%c[Check Session]%s', 
        'background:green; color:white', 
        'ok');
        const session = getSessionKeyAndOpenId(wx);
        if (!session) {
          reject({code:2, msg: 'login state expired'});
        } else {
          resolve({ code: 0, data: session });
        }
      },
      fail: function () {
        console.log('%c[Check Session]%s', 
        'background:red; color:white', 
        'fail');
        reject({code:1});
      }
    })
  });
}

const setSessionKeyAndOpenId = (wx, data) => {
  wx.setStorageSync('sess_open', JSON.stringify(data));
}

const getSessionKeyAndOpenId = (wx) => {
  const bundle = wx.getStorageSync('sess_open');
  if (bundle) {
    const sess = JSON.parse(bundle);
    if (sess) {
      return sess;
    }
  }
  return null;
}

module.exports.loginBefore = loginBefore;
module.exports.getSessionKeyAndOpenId = getSessionKeyAndOpenId;
module.exports.setSessionKeyAndOpenId = setSessionKeyAndOpenId;