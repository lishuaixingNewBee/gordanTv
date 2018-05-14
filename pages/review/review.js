const util = require('../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
const swiperList = {
  "status": 0,
  "data": {
    "banner": [{
      "id": "27602222",
      "title": "向往的生活",
      "thumbnails": "http://m.qiyipic.com/common/lego/20180511/182dd81283de4f6b8ece2953735243f2.jpg"
    },
    {
      "id": "27625644",
      "title": "小猪佩奇",
      "thumbnails": "http://m.qiyipic.com/common/lego/20180424/064f2e9901b54731926fea7cca783beb.jpg"
    }, {
      "id": "25938113",
      "title": "火影忍者",
      "thumbnails": "http://m.qiyipic.com/common/lego/20180510/7a4b7a02f2684eab922640ac556b9d71.jpg"
    }, {
      "id": "24773958",
      "title": "复仇者联盟",
      "thumbnails": "https://puui.qpic.cn/vcover_hz_pic/0/w7ju7urc1x4w3jct1472461377.jpg/0"
    }
    ]
  }
}
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
    console.log(swiperList.data.banner)
    let list = swiperList.data.banner;
    this.setData({
      swiperList: list
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