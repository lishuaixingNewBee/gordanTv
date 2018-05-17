// pages/music/music.js
const util = require('../../utils/util.js');
const musicUrl = getApp().globalData.musicBase;
Page({
  data: {
    isLoading: false,
    hasMore: true,
    id: 0,
    musicList: []
  },
  onLoad() {
    this.getList('down')
  },
  getList(type) {
    this.setData({
      isLoading: true,
      hasMore: true
    })
    type === 'down' ? this.setData({ id: 0 }) : null;
    util.$get(`${musicUrl}/api/channel/music/more`, { id: this.data.id }).then(res => {
      if (res.data.res === 0) {
        this.processData(type, res.data.data)
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
        return v.post_date = util.formatTime(new Date(v.post_date.replace(/-/g, '/')), 'yyyy-MM-dd')
      })
      if (type === 'up') { // 上拉处理
        this.setData({
          musicList: this.data.musicList.concat(list)
        })
      } else { // 下拉出来
        this.setData({
          musicList: list
        })
        wx.stopPullDownRefresh()
      }
      this.setData({
        id: list[list.length - 1].id,
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
  },
  onReachBottom() {
    if (this.data.isLoading) { // 防止数据还没回来再次触发加载
      return;
    }
    this.getList('up')
  },
  openDetail(event) {
    let item = event.currentTarget.dataset.list
    wx.navigateTo({
      url: `music-detail/music-detail?id=${item.item_id}&title=${item.title}`
    })
  },
  onColletionTap(event) { // 点击收藏
    // this.getPostsCollectedSyc();
    this.getPostsCollectedAsy();
  }
})
