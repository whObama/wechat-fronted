import { request } from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销售",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: [],
    total: 0
  },
  // 总页数
  totalPage: 1,
  params: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.cid = options.cid || ''
    this.params.query = options.query || ''
    this.getGoodsList()
  },
  getGoodsList() {
    request({ url: '/goods/search', data: this.params}).then(
      res => {
        if (res.meta.status === 200) {
          const total = res.message.total
          this.totalPage = Math.ceil(total/ this.params.pagesize)
          this.setData({
            goodsList: [...this.data.goodsList, ...res.message.goods]
          })
          // 关闭下拉刷新的窗口
          wx.stopPullDownRefresh()
        }
      }
    ).catch(err => console.log(err))
  },
  // tabs子组件传递事件
  tabsItemChange(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  },
  // 页面上拉触底事件的处理函数
  onReachBottom() {
    if (this.params.pagenum >= this.totalPage) {
      wx.showToast({ title: '没有下一页' });
    } else {
      this.params.pagenum++
      this.getGoodsList()
    }
  },
  // 监听用户下拉动作
  onPullDownRefresh() {
    this.setData({
      goodsList: []
    })
    this.params.pagenum = 1
    this.getGoodsList()
  }
})