import { getSetting, chooseAddress, openSetting, showModal, showToast } from '../../utils/asyncWx'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cartList: [],
    // 全选
    allChecked: false,
    // 总价格
    totalPrice: 0,
    // 总数量
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync('address');
    const cart = wx.getStorageSync('cart') || [];
    this.setData({
      address
    })
    this.setCart(cart)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleChooseAddress() {
    getSetting().then(
      result => {
        // 获取权限状态, 属性名,要是用 []形式来获取属性值
        const scopeAddress = result.authSetting['scope.address']
        if (scopeAddress === true || scopeAddress === undefined )  {
          // 获取收货地址
          chooseAddress().then(
            res => {
              wx.setStorageSync('address', res);
            }
          ).catch(err => console.log(err))
        } else {
          openSetting()
            .then(res =>{
              // 获取收货地址
              chooseAddress().then(
                res => {
                  wx.setStorageSync('address', res);
                }
              ).catch(err => console.log(err))
            })
            .catch(err => console.log(err))
        }
        
      }
    )
  },
  // 修改商品选中状态
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id
    let { cartList } = this.data;
    const index = cartList.findIndex(item => item.goods_id === goods_id)
    cartList[index].checked = !cartList[index].checked
    this.setCart(cartList)
  },
  setCart(cart) {
    let allChecked = true
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(item => {
      if (item.checked) {
        totalPrice += item.goods_price * item.num
        totalNum += item.num
      } else {
        allChecked = false
      }
    })
    allChecked = cart.length > 0 ? allChecked : false
    this.setData({
      cartList: cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart)
  },
  // 点击全选
  handleItemAllCheck() {
    let { cartList, allChecked } = this.data
    allChecked = !allChecked
    cartList.forEach(item => item.checked = allChecked)
    this.setCart(cartList)
  },
  // 修改商品数量
  handleItemNumEdit(e) {
    let { id, operation } = e.currentTarget.dataset
    let { cartList } = this.data
    let index = cartList.findIndex(item => item.goods_id === id)
    if (cartList[index].num === 1 && operation === -1) {
      return showModal({ content: '您是否要删除?' }).then(
        res => {
          if (res.confirm) {
            cartList.splice(index, 1)
            this.setCart(cartList)
          }
        }
      )
    }
    cartList[index].num += operation
    this.setCart(cartList)
  },
  // 结算
  handlePay() {
    const { address, totalNum } = this.data
    if (totalNum <= 0) {
      return showToast({ title: '您还没有选购商品!'})
    }
    if (!address.userName) {
      return showToast({ title: '您还没有选择收货地址!'})
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})