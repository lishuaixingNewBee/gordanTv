// pages/movies/video-detail/video-detail.js
const util = require('../../../utils/util.js')
const movieUrl = getApp().globalData.movieBase
Page({
  data: {
    video: null,
    movieList: [],
  },
  onLoad(option) {
    this.setData({
      video: {
        time: decodeURIComponent(option.time),
        url: decodeURIComponent(option.url),
        title: decodeURIComponent(option.title)
      }
    })
    wx.setNavigationBarTitle({ // 设置当前标题
      title: decodeURIComponent(option.title)
    })
    this.getList()
  },
  getList() { // 获取推荐电影
    util.$get(`${movieUrl}/api/v2/article`, { app_id: 6, cid: 4, article_id: 0 }).then(res => {
      if (res.data.status === 0) {
        res.data.data.articles.map(v => { // 转换一下时间
          v.create_time = util.formatTime(new Date(), 'yyyy-MM-dd')
          v.thumbnails[0].url = v.thumbnails[0].url.replace(/(\.\w{3,4})$/i, "_crop" + 234 + "x" + 146 + "$1")
        })
        this.setData({
          movieList: res.data.data.articles
        })
      }
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  }, openDetail(event) {
    let item = event.currentTarget.dataset.list
    let url = `../video-detail/video-detail?title=${item.title}&time=${item.create_time}&url=${item.videos[0].video_src}`
    // wx.navigateTo({  // 会反复打开新窗口，最多十层。
    //   url: url
    // })
    wx.redirectTo({  // 关闭当前页面，跳转到应用内的某个页面,不触发OnHide()方法,且能直接返回到tab页面
      url: url
    })
  },
  onShareAppMessage() {
  }
})
