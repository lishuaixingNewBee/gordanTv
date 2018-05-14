// pages/review/search/search.js
const util = require('../../../utils/util.js');
const doubanUrl = getApp().globalData.doubanBase;
const hotTag = ['动作', '喜剧', '爱情', '悬疑'];
Page({
  data: {
    searchType: 'keyword',
    hotKeyword: null,
    hotTag
  },
  onLoad (options) {
    this.getHotKeyword()
  },
  getHotKeyword() { // 获取热词
    util.$get(doubanUrl + '/v2/movie/coming_soon', {start: 0, count: 10}).then(res => {
      this.setData({
        hotKeyword: res.data.subjects
      })
    })
  },
  changeSearchType () {
    let types = ['默认', '类型'];
    let searchType = ['keyword', 'tag']
    wx.showActionSheet({
      itemList: types,
      success: (res) => {
        if (!res.cancel) {
          this.setData({
            searchType: searchType[res.tapIndex]
          })
        }
      }
    })
  },
  searchA(e){
    this.search(e.detail.value.keyword)
  },
  searchB(e) {
    this.search(e.detail.value)
  },
  search(keyword) {
    if (keyword == '') {
      wx.showToast({ title: `请输入内容!`, duration: 1500, icon: "none" })
      return false
    } else {
      wx.navigateTo({
        url: `../more-movie/more-movie?category=${this.data.searchType}&title=${encodeURIComponent(keyword)}`
      })
    }
  },
  searchByKeyword (e) {
    let keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `../more-movie/more-movie?category=keyword&title=${keyword}`
    })
  },
  searchByTag (e) {
    let keyword = e.currentTarget.dataset.keyword;
    wx.navigateTo({
      url: `../more-movie/more-movie?category=tag&title=${keyword}`
    })
  }
})