let requestCount = 0
export const request=(params) => {
  // 是否添加请求头
  let header = {...params.header}
  if (params.url.includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token');
  }
  requestCount++;
  // 加载图标
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1'
  return new Promise((resolve, reject)=> {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data)
      },
      fail: (error) => {
        reject(error)
      },
      complete: ()=>{
        requestCount--;
        if(requestCount === 0) {
          wx.hideLoading();
        }
      }
    })
  })
}