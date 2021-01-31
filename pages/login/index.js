// pages/login/index.js
Page({
  handleLogin(e) {
    wx.setStorageSync('userInfo', e.detail.userInfo);
    wx.navigateBack({
      delta: 1
    });
  }
})