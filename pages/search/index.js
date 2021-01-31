import { request } from '../../utils/request'
Page({
  data: {
    searchList: [],
    timer: null,
    // 控制取消按钮
    isFocus: false,
    // 输入框的值
    inputValue: ''
  },
  onLoad: function (options) {

  },
  handleInput(e) {
    const { value } = e.detail
    if (!value.trim()) {
      this.setData({
        searchList: [],
        isFocus: false
      })
      return
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      request({ url: '/goods/qsearch', data: { query: value }}).then(
        res => {
          if (res.meta.status === 200) {
            this.setData({
              searchList: res.message,
              isFocus: true
            })
          }
        }
      ).catch(err => console.log(err))
    }, 1000)  
  },
  handleCancel () {
    this.setData({
      inputValue: '',
      searchList: [],
      isFocus: false
    })
  }
})