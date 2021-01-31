import { request } from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    isCollect: false
  },
  params: {
    goods_id: '',
  },
  Goods: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.params.goods_id = options.goods_id
    this.getGoodsData()
  },
  getGoodsData() {
    request({ url: '/goods/detail', data: this.params}).then(
      res => {
        if (res.meta.status === 200) {
          let goods = res.message
          this.Goods = res.message
          let collect = wx.getStorageSync('collect') || [];
          this.setData({
            isCollect: collect.some(item => item.goods_id === this.Goods.goods_id),
            goodsObj: {
              pics: goods.pics,
              goods_price: goods.goods_price,
              goods_name: goods.goods_name,
              goods_introduce: goods.goods_introduce.replace(/\.webp/g, '.jpg')
            }
          })
        }
      }
    ).catch(err => console.log(err))
  },
  // 大图展示
  handlePreviewImg(e) {
    let urls = this.Goods.pics.map(i => i.pics_mid)
    let current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    });
  },
  // 加入购物车
  addGoodsCart() {
    let cart = wx.getStorageSync('cart') || [];
    let index = cart.findIndex(i => i.goods_id === this.Goods.goods_id)
    if (index === -1) {
      this.Goods.num = 1;
      this.Goods.checked = true;
      cart.push(this.Goods);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入成功',
      mask: true
    });
  },
  // 点击收藏
  handleCollect() {
    let collect = wx.getStorageSync('collect') || [];
    let index = collect.findIndex(item => item.goods_id === this.Goods.goods_id)
    if (index !== -1) {
      collect.splice(index, 1)
      this.setData({
        isCollect: false
      })
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true,
      });
    } else {
      collect.push(this.Goods)
      this.setData({
        isCollect: true
      })
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    wx.setStorageSync('collect', collect);
  }
})