// pages/post/posts.js
const util = require('../../utils/util.js')
const movieUrl = getApp().globalData.movieBase
Page({
  data: {
    movieList: null,
    swiperList: null,
    isLoading: false,
    hasMore: true,
    article_id: 0
  },
  onLoad() {
    this.initSwiper() // 加载轮播图
    this.getList('down')
  },
  getList(type) {
    this.setData({
      isLoading: true,
      hasMore: true
    })
    type === 'down' ? this.setData({ article_id: 0 }) : null;
    util.$get(`${movieUrl}/api/v2/article`, { app_id: 6, cid: 4, article_id: this.data.article_id }).then(res => {
      if (res.data.status === 0) {
        this.processData(type, res.data.data.articles)
      }
    }).catch(e => {
      this.setData({
        isLoading: true,
        hasMore: false
      })
      wx.stopPullDownRefresh()
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  },
  processData(type, list) {
    if (list.length) {
      list.map(v => { // 转换一下时间
        v.create_time = util.formatTime(new Date(), 'yyyy-MM-dd')
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
        article_id: ++this.data.article_id,
        isLoading: false,
        hasMore: true
      })
    } else {
      if (type === 'down') {
        wx.showToast({ title: `没有数据`, duration: 1500, icon: "none" })
        this.setData({
          isLoading: false,
          hasMore: false
        })
      } else {
        this.setData({
          isLoading: false,
          hasMore: true
        })
      }
    }

  },
  onPullDownRefresh() {
    this.getList('down')
    this.initSwiper() // 加载轮播图
  },
  onReachBottom() {
    if (this.data.isLoading) { // 防止数据还没回来再次触发加载
      return;
    }
    this.getList('up')
  },
  initSwiper() {
    util.$get(`${movieUrl}/api/v2/article`, { app_id: 6, cid: 4, article_id: 0 }).then(res => {
      if (res.data.status === 0) {
        let swiperList = res.data.data.articles.map(v => {
          return { // 转换一下时间
            create_time: v.create_time = util.formatTime(new Date(v.create_time), 'yyyy-MM-dd'),
            article_id: v.article_id,
            title: v.title,
            content: v.content,
            video_src: v.videos[0].video_src,
            thumbnails: v.thumbnails[0].url
          }
        })
        this.setData({
          swiperList
        })
      }
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  },
  openDetail(event) {
    let item = event.currentTarget.dataset.list
    let url = `video-detail/video-detail?title=${item.title}&time=${encodeURIComponent(item.create_time)}&url=${item.videos[0].video_src}`
    wx.navigateTo({
      url: url
    })
  },
  onSwiperTap(event) {
    let item = event.currentTarget.dataset.item
    let url = `video-detail/video-detail?title=${item.title}&time=${encodeURIComponent(item.create_time)}&url=${item.video_src}`
    wx.navigateTo({
      url: url
    })
  }
})
