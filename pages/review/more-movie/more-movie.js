// pages/review/more-movie/more-movie.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;

Page({
  data: {
    requestUrl: "",
    movieList: [],
    sendData: {
      start: 0,  // 总条数
      count: 18, // 每页加载条数
      q: undefined,
      tag: undefined
    },
    noData: false,
    isLoading: true,
    hasMore: false
  },
  onLoad(options) {
    let category = options.category;
    let url = ''
    switch (category) {
      case "正在热映":
        url = "/v2/movie/in_theaters";
        break;
      case "即将上映":
        url = "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        url = "/v2/movie/top250";
        break;
      case "tag":
        url = "/v2/movie/search";
        this.data.sendData.tag = options.title;
        break;
      case "keyword":
        url = "/v2/movie/search";
        this.data.sendData.q = options.title;
        break;
    }
    this.data.requestUrl = doubanUrl + url
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.title)
    })
    this.getList('down');
  },
  getList(type) {
    this.setData({
      isLoading: true,
      hasMore: false
    })
    wx.showNavigationBarLoading() // 开启顶部loading
    type === 'down' ? this.data.sendData.start = 0 : this.data.sendData.start;
    let data = Object.assign({}, this.data.sendData)
    data.start = data.start * data.count
    util.$get(this.data.requestUrl, data).then(res => {
      this.processDoubanData(type, res.data.subjects)
      wx.hideNavigationBarLoading()
    }).catch(e => {
      this.setData({
        isLoading: false,
        hasMore: false
      })
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      wx.showToast({ title: `网络错误!`, duration: 1500, icon: "none" })
    })
  },
  processDoubanData(type, data) {
    if (data.length) {
      let list = data.map((v) => {
        return {
          stars: util.convertToStarsArray(v.rating.average),  // 处理星星评分
          title: v.title,
          average: v.rating.average,
          coverageUrl: v.images.large,
          movieId: v.id
        }
      })
      if (type === 'up') { // 上拉处理
        this.setData({   
          movieList: this.data.movieList.concat(list)
        })
      } else { // 下拉出来
        this.setData({
          movieList: list
        })
        wx.stopPullDownRefresh()
      }
      this.setData({
        'sendData.start': ++this.data.sendData.start,
        isLoading: false,
        hasMore: false
      })
    } else {
      if (type === 'down') {
        wx.showToast({ title: `没有数据`, duration: 1500, icon: "none" })
        this.setData({
          isLoading: false,
          noData: true,
          hasMore: false
        })
        wx.stopPullDownRefresh()
      } else {
        this.setData({
          isLoading: false,
          hasMore: true
        })
      }
    }
  },
  openDetail(event) {
    let item = event.currentTarget.dataset;
    if (this.data.sendData.tag) {
      wx.redirectTo({
        url: `../review-detail/review-detail?id=${item.movieid}&title=${item.title}`
      })
    } else {
      wx.navigateTo({
        url: `../review-detail/review-detail?id=${item.movieid}&title=${item.title}`
      })
    }
  },
  onPullDownRefresh() {
    this.getList('down')
  },
  onReachBottom() {
    if (this.data.isLoading) { // 防止数据还没回来再次触发加载
      return;
    }
    this.getList('up')
  }
})