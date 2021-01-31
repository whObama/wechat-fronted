Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],
    textValue: ''
  },
  uploadImgs: [],
  tabsItemChange(e) {
    const { index } = e.detail
    let { tabs } = this.data
    tabs.forEach((item, i) => i === index ? item.isActive = true : item.isActive = false)
    this.setData({
      tabs
    })
  },
  onLoad: function (options) {

  },
  handleUpload() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs: [...this.data.chooseImgs, result.tempFilePaths]
        })
      }
    });
  },
  handleRemove(e) {
    const { index } = e.currentTarget.dataset
    let { chooseImgs } = this.data
    chooseImgs.splice(index, 1)
    this.setData({ chooseImgs })
  },
  bindInputchange(e) {
    this.setData({
      textValue: e.detail.value
    })
  },
  handleFormSumit() {
    const { textValue, chooseImgs } = this.data
    if(!textValue.trim()) {
      return wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
    }
    chooseImgs.length > 0 && chooseImgs.forEach((item, index) => {
      wx.uploadFile({
        url: 'https://images.ac.cn/Home/Index/UploadAction/',
        filePath: item,
        name: 'file',
        formData: {},
        success: (result)=>{
          console.log(result)
          let url = JSON.parse(result.data).url
          this.uploadImgs.push(url)
        }
      });
      if (index === chooseImgs.length -1) {
        console.log('把文本的内容和外网的图片数组 提交到后台中')
        // 返回成功 重置页面并返回上一个页面
        this.setData({
          textValue: '',
          chooseImgs: []
        })
        wx.navigateBack({
          delta: 1
        });
      }
    })
  }
})