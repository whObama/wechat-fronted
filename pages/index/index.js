import { request } from '../../utils/request'
wx-Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [],
    cateList: [],
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSwiperData()
    this.getCateList()
    this.getFloorList()
  },
  initSwiperData() {
    request({ url: '/home/swiperdata' }).then(
      res => {
        if (res.meta.status === 200) {
          this.setData({
            swiperList: res.message.map(item => {
              item.navigator_url = item.navigator_url.replace('main', 'index')
              return item
            })
          })
        }
      }
    ).catch(err => console.log(err))
  },
  getCateList() {
    request({ url: '/home/catitems' }).then(
      res => {
        if (res.meta.status === 200) {
          this.setData({
            cateList: res.message
          })
        }
      }
    ).catch(err => console.log(err))
  },
  getFloorList() {
    request({ url: '/home/floordata' }).then(
      res => {
        if (res.meta.status === 200) {
          let arr = res.message.map(item => {
            item.product_list.forEach(i => {
              i.navigator_url = i.navigator_url.replace('?', '/index?')
            })
            return item
          })
          this.setData({
            floorList: arr
          })
        }
      }
    ).catch(err => console.log(err))
  }
})