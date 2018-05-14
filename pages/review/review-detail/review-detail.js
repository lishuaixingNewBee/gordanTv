// pages/review/review-detail/review-detail.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
Page({
  data: {
    filmDetail: {},
    isLoading: true,
    id: ''
  },
  onLoad(option) {
    this.data.id = option.id;
    wx.setNavigationBarTitle({ // 设置当前标题
      title: decodeURIComponent(option.title)
    })
    wx.showLoading({
      title: '加载中'
    })    
    wx.showNavigationBarLoading() // 开启顶部loading
    this.getList();
  },
  getList() {
    util.$get(doubanUrl + '/v2/movie/subject/'+this.data.id).then( res => {
      res.data.stars = util.convertToStarsArray(res.data.rating.average),  // 处理星星评分
      this.setData({
        filmDetail: res.data
      })
      this.setData({
        isLoading: false
      })
      wx.hideNavigationBarLoading()
      wx.hideLoading()
    }).catch(e => {
      wx.hideNavigationBarLoading()
      wx.showToast({ title: `网络错误!`, duration: 1500, icon: "none" })
      this.setData({
        isLoading: false
      })
      wx.hideLoading()
    })
  }, 
  viewPersonDetail (e) { // 点击演员/导演
    let data = e.currentTarget.dataset;
    if (!data.id){
      wx.showToast({ title: `没有找到相关信息!`, duration: 1500, icon: "none" })
      return;
    }
    wx.redirectTo({
      url: `../person-detail/person-detail?id=${data.id}&title=${data.title}`
    })
  },
  viewFilmByTag (e) { // 点击标签
    let item = e.currentTarget.dataset
    wx.redirectTo({
      url: `../more-movie/more-movie?category=tag&title=${item.tag}`
    })
  },
  viewMoviePostImg (e) { /*查看图片*/
    let src = e.currentTarget.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage() {

  }
})