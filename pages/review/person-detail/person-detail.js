// pages/review/person-detail/person-detail.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
Page({
  data: {
    personDetail: {},
    id:'',
    movieList: [],
    isLoading: true
  },
  onLoad (options) {
    wx.showNavigationBarLoading() // 开启顶部loading
    wx.showLoading({
      title: '加载中'
    })
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.title)
    })
    this.data.id = options.id
    this.getList();
  },
  getList() {  // 由于豆瓣多年，以前的一些老数据没有维护，id返回的时null
    util.$get(doubanUrl + '/v2/movie/celebrity/' + this.data.id).then(res => {
      let list = res.data.works.map((v) => {
        return {
          stars: util.convertToStarsArray(v.subject.rating.average),  // 处理星星评分
          title: v.subject.title,
          average: v.subject.rating.average,
          coverageUrl: v.subject.images.large,
          movieId: v.subject.id
        }
      })
      this.setData({
        isLoading: false,
        personDetail:res.data,
        movieList: list
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
  openDetail(event) {
    let item = event.currentTarget.dataset;
    wx.redirectTo({
      url: `../review-detail/review-detail?id=${item.movieid}&title=${item.title}`
    })
  },
  onShareAppMessage () {

  }
})