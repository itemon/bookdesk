/* debug utils */

/*
 * report system info
 */
const envInfo = (wx) => {
    wx.getSystemInfo({
      success: function(res) {
        const {version, SDKVersion} = res;
        console.log(
            "%c[ENV INFO] client version: %s; SDK version: %s",
            'background:red; color:#fff', 
            version, 
            SDKVersion);
      }
    })
}

exports.envInfo = envInfo;