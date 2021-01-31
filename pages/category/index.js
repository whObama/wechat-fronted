import { request } from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuLeftList: [],
    menuRightList: [],
    // 当前选中项
    currentIndex: 0,
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let Cates = wx.getStorageSync('cates')
    if (!Cates) {
      this.getMenuData()
    } else {
      if (Date.now() > Cates.time + 1000 * 60 * 5) {
        this.getMenuData()
      } else {
        this.setData({
          menuLeftList: Cates.data,
          menuRightList: Cates.data.length > 0 ? Cates.data[0].children : []
        })
      }
    }
    
  },
  getMenuData() {
    request({ url: '/categories' }).then(
      res => {
        if (res.meta.status === 200) {
          let cates = res.message || []
          wx.setStorageSync('cates', { time: Date.now(), data: cates })
          this.setData({
            menuLeftList: cates,
            menuRightList: cates.length > 0 ? cates[0].children : []
          })
        }
      }
    ).catch(err => console.log(err))
  },
  handleItemTap(e){
    const { index } = e.currentTarget.dataset
    this.setData({
      currentIndex: index,
      menuRightList: this.data.menuLeftList[index].children,
      scrollTop: 0
    })
  }
})