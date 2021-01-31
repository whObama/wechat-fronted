import { request } from '../../utils/request'
Page({
  data: {
    orders: [],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false
      }
    ],
  },
  changeTitleByIndex (index) {
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  },
  tabsItemChange(e) {
    const { index } = e.detail
    this.changeTitleByIndex(index)
    this.initData(index+1)
  },
  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      return wx.navigateTo({
        url: '/pages/auth/index'
      })
    }
    let pages = getCurrentPages();
    let currentPage = pages[pages.length -1]
    let { type } = currentPage.options
    this.changeTitleByIndex(type-1)
    this.initData(type)
  },
  initData(type) {
    request({ url: '/my/orders/all', data: { type} }).then(
      res => {
        if (res.meta.status === 200) {
          this.setData({
            orders: res.message.orders.map(item => ({...item, create_time_cn: (new Date(item.create_time * 1000).toLocaleString())}))
          })
        }
      }
    ).catch(err => console.log(err))
  }
})