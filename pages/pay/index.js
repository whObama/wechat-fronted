import { requestPayment } from '../../utils/asyncWx';
import { request } from '../../utils/request';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cartList: [],
    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address');
    let cart = wx.getStorageSync('cart') || [];
    cart = cart.filter(item => item.checked)
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      totalPrice += item.goods_price * item.num
      totalNum += item.num
    })
    this.setData({
      cartList: cart,
      address,
      totalPrice,
      totalNum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 支付
  handlePay() {
    const token = wx.getStorageSync('token');
    if (!token) {
      return wx.navigateTo({
        url: '/pages/auth/index'
      });
    }
    // 创建订单
    const order_price = this.data.totalPrice
    const consignee_addr = this.data.address.all
    const cart = this.data.cartList
    let goods = []
    cart.forEach(item => goods.push({
      goods_id: item.goods_id,
      goods_number: item.num,
      goods_price: item.goods_price
    }))
    let params = { order_price, consignee_addr, goods }
    request({ url: '/my/orders/create', method: 'post', data: params }).then(
      res => {
        if (res.meta.status === 200 &&  res.message.order_number) {
          this.prePay(res.message.order_number)
        }
      }
    ).catch(err => console.log(err))
  },
  prePay(order_number) {
    // 预支付
    request({ url: '/my/orders/req_unifiedorder', method: 'post', data: { order_number } }).then(
      res => {
        if (res.meta.status === 200) {
          const params = {...res.message.pay}
          console.log(params)
          // ------todo----支付账号的切换
          requestPayment(params).then(
            res => {
              console.log(res)
            }
          ).catch(err => console.log(err))

        }
        // 查询订单状态
        request({ url: '/my/orders/chkOrder', method: 'post', data: { order_number } }).then(
          res => {
            console.log(res)
            if (res.meta.status === 200) {
              let newCart = wx.getStorageSync('cart');
              newCart = newCart.filter(item => !item.checked)
              wx.setStorageSync('cart', newCart);
            }
            wx.navigateTo({
              url: '/pages/order/index'
            });
          }
        )
      }
    ).catch(err => console.log(err))
  }
})