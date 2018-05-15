const util = require('../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
const bannerUrl = getApp().globalData.musicBase;

Page({
  data: {
    swiperList: [],
    searchResult: {},
    isLoading: true,
    searchPanelShow: false
  },

  onLoad(event) {
    wx.showLoading({
      title: '加载中'
    })
    this.getMovieListData(`/v2/movie/in_theaters`, { start: 0, count: 6 }, "inTheaters", "正在热映");
    this.getMovieListData(`/v2/movie/coming_soon`, { start: 0, count: 6 }, "comingSoon", "即将上映");
    this.getMovieListData(`/v2/movie/top250`, { start: 0, count: 6 }, "top250", "豆瓣Top250");
    this.initSwiper();
  },
  onMoreTap(event) {
    let item = event.currentTarget.dataset;
    wx.navigateTo({
      url: `more-movie/more-movie?category=${item.category}&title=${item.title}`
    })
  },
  onSwiperTap(event) {
    let item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `review-detail/review-detail?id=${item.id}&title=${item.title}`
    })
  },
  openDetail(event) {
    let item = event.currentTarget.dataset;
    wx.navigateTo({
      url: `review-detail/review-detail?id=${item.movieid}&title=${item.title}`
    })
  },
  initSwiper() {
    util.$get(bannerUrl + '/api/tv/banner').then(res => {
      if (res.data.status === 0) {
        this.setData({
          swiperList: res.data.data
        })
      }
    })
  },
  viewSearch() { // 打开搜索页面
    wx.navigateTo({
      url: 'search/search'
    })
  },
  getMovieListData(url, sendData, settedKey, categoryTitle) {
    util.$get(doubanUrl + url, sendData).then(res => {
      this.processDoubanData(res.data, settedKey, categoryTitle)
    }).catch(e => {
      wx.hideLoading()
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  },
  processDoubanData(data, settedKey, categoryTitle) {
    let list = data.subjects.map((v) => {
      return {
        stars: util.convertToStarsArray(v.rating.average),  // 处理星星评分
        title: v.title,
        average: v.rating.average,
        coverageUrl: v.images.large,
        movieId: v.id
      }
    })
    this.setData({
      [settedKey]: {
        categoryTitle: categoryTitle,
        movies: list
      }
    })
    if (this.data.inTheaters && this.data.comingSoon && this.data.top250) {
      wx.hideLoading()
    }
  }
})