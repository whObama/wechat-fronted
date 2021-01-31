import { login } from '../../utils/asyncWx'
import { request } from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleGetUserInfo(e) {
    try {
      const { encryptedData, rawData, signature, iv } = e.detail
      login().then(
        res => {
          if (res.code) {
            let params = { encryptedData, rawData, signature, iv, code: res.code }
            request({ url: '/users/wxlogin', method: 'post', data: params }).then(
              res => {
                wx.setStorageSync('token', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
                wx.navigateBack({
                  delta: 1
                });
              }
            ).catch(err => console.log(err))
          }
        }
      ).catch(err => console.log(err))
    } catch (error) {
      console.log(error)
    }
  }
})