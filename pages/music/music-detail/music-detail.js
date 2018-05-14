const util = require('../../../utils/util.js');
const musicUrl = getApp().globalData.musicBase;
const QQMusicUrl = getApp().globalData.QQMusicBase;
const app = getApp();
Page({
  data: {
    id: '',
    music_id: '',
    isPlayingMusic: false,
    isLoding: true,
    isPlay: false,
    isMusic: false,
    musicSrc: '',
    content: null,
    postsCollected: false // 文章是否收藏
  },
  onLoad(option) {
    this.data.id = option.id;
    wx.setNavigationBarTitle({ // 设置当前标题
      title: decodeURIComponent(option.title)
    })
    this.isCollected();
    this.getDetail();
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.id) {
      this.setData({
        isLoding: false,
        isMusic: true,
        isPlay: true
      })
    } else if (!app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === this.data.id) {
      this.setData({
        isLoding: false,
        isMusic: true,
        isPlay: false
      })
    }
    this.setMusicMonitor();
  },
  getDetail() {
    util.$get(`${musicUrl}/api/music/detail?`, { id: this.data.id }).then((res) => {
      res.data.data.last_update_date = util.formatTime(new Date(res.data.data.last_update_date), 'yyyy-MM-dd')
      this.setData({
        content: res.data.data
      })
      util.wxParse('article', 'html', res.data.data.story, this, 15);
      this.setData({
        isLoading: false
      })
      this.initMusic()
    }).catch(e => {
      this.setData({
        isLoading: false
      })
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  },
  setMusicMonitor() {
    wx.onBackgroundAudioPlay((event) => { // 点击播放图标和总控开关都会触发这个函数
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      if (currentPage.data.id === this.data.id) {
        // 打开多个post-detail页面后，每个页面不会关闭，只会隐藏。通过页面栈拿到到
        // 当前页面的id，只处理当前页面的音乐播放。
        if (app.globalData.g_currentMusicPostId == this.data.id) {
          // 播放当前页面音乐才改变图标
          this.setData({
            isLoding: false,
            isMusic: true,
            isPlay: true
          })
        }
        // if(app.globalData.g_currentMusicPostId == this.data.id )
        // app.globalData.g_currentMusicPostId = this.data.id;
      }
      app.globalData.g_isPlayingMusic = true;
    });
    wx.onBackgroundAudioPause(() => {
      let pages = getCurrentPages();
      let currentPage = pages[pages.length - 1];
      if (currentPage.data.id === this.data.id) {
        if (app.globalData.g_currentMusicPostId == this.data.id) {
          this.setData({
            isLoding: false,
            isMusic: true,
            isPlay: false
          })
        }
      }
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(() => {
      this.setData({
        isLoding: false,
        isMusic: true,
        isPlay: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },
  initMusic() { // 初始化音乐，由于没有解决音乐接口，用虾米音乐代替;
    util.$get(`${QQMusicUrl}/soso/fcgi-bin/search_for_qq_cp?g_tk=5381&uin=0&format=jsonp&inCharset=utf-8&outCharset=utf-8&notice=0&platform=h5&needNewCode=1&w=${this.data.content.title}${this.data.content.author.user_name}&zhidaqu=1&catZhida=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&perpage=20&n=20&p=1&remoteplace=txt.mqq.all&_=1520833663464`).then(res => {
      let list = JSON.parse(res.data.match(/callback\((.*)\)/)[1]).data.song.list;
      if (list.length) {
        this.data.music_id = list[0].songmid;
        this.setData({
          isLoding: false, // 结束loding动画
          isMusic: true, //  歌曲存在
          musicSrc: `http://ws.stream.qqmusic.qq.com/C100${this.data.music_id}.m4a?fromtag=0&guid=126548448`
        })
      } else {
        this.setData({
          isLoding: false, // 结束loding动画
          isMusic: false //  歌曲存在
        })
        wx.showToast({ title: `暂无音乐版权!`, duration: 1000, icon: "none" })
      }
    }).catch(e => {
      wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
    })
  },
  onMusicTap() { // 音乐播放按钮
    if (this.data.isLoding) {
      return;
    }
    if (!this.data.isMusic) {
      wx.showToast({ title: `暂无音乐版权!`, duration: 1000, icon: "none" })
      return;
    }
    if (this.data.isPlay) { // 暂停音乐
      wx.pauseBackgroundAudio();
      this.setData({
        isPlay: false
      })
      // app.globalData.g_currentMusicPostId = null;
      app.globalData.g_isPlayingMusic = false; // 总开关 关闭
    }
    else {
      wx.playBackgroundAudio({ // 播放音乐
        dataUrl: this.data.musicSrc,
        title: `${this.data.content.title}-${this.data.content.author.user_name}`,
        coverImgUrl: this.data.content.cover
      })
      this.setData({
        isPlay: true
      })
      app.globalData.g_currentMusicPostId = this.data.id;
      app.globalData.g_isPlayingMusic = true;
    }
  },
  isCollected() { // 利用本地缓存判断是否收藏过此文章
    let postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      let bol = postsCollected[this.data.id]
      if (bol) {
        this.setData({
          collected: bol
        })
      }
    }
    else {
      let postsCollected = {};
      postsCollected[this.data.id] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
  },
  onColletionTap(event) {
    this.getPostsCollectedSyc(); // 同步
    // this.getPostsCollectedAsy();    // 异步
  },
  getPostsCollectedSyc() {
    let postsCollected = wx.getStorageSync('posts_collected');
    let bol = postsCollected[this.data.id];
    // 收藏变成未收藏，未收藏变成收藏
    bol = !bol;
    postsCollected[this.data.id] = bol;
    this.showToast(postsCollected, bol);
  },
  getPostsCollectedAsy() {
    wx.getStorage({
      key: "posts_collected",
      success: (res) => {
        let postsCollected = res.data;
        let bol = postsCollected[this.data.id];
        // 收藏变成未收藏，未收藏变成收藏
        bol = !bol;
        postsCollected[this.data.id] = bol;
        this.showToast(postsCollected, bol);
      }
    })
  },
  showModal(postsCollected, bol) { // confirm 弹出框
    wx.showModal({
      title: "收藏",
      content: bol ? "收藏该文章？" : "取消收藏该文章？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#405f80",
      success: (res) => {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          // 更新数据绑定变量，从而实现切换图片
          this.setData({
            collected: bol
          })
        }
      }
    })
  },
  showToast(postsCollected, bol) { // 弹出框
    // 更新文章是否的缓存值
    wx.setStorageSync('posts_collected', postsCollected);
    // 更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: bol
    })
    wx.showToast({
      title: bol ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },
  onShareTap(event) {
    let itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: (res) => {
        // res.cancel 用户是不是点击了取消按钮
        // res.tapIndex 数组元素的序号，从0开始
        wx.showModal({
          title: "用户 " + itemList[res.tapIndex],
          content: "暂时不支持第三方分享，试试顶部的转发功能！"
        })
      }
    })
  },
  onShareAppMessage(res) {
  },
  methods: {
  }
})