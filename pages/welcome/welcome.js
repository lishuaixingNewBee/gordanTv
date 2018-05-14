const app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },
  goToIndex() {
    wx.switchTab({
      url: '../music/music',
    });
  },
  onLoad () {
    wx.setNavigationBarTitle({
      title: `狗蛋TV`
    })
    app.getUserInfo((userInfo) => {
      this.setData({
        userInfo: userInfo
      })
    })
  },
  onReady () {
    setTimeout( () => {
      this.setData({
        remind: ''
      });
    }, 1000);
    wx.onAccelerometerChange( (res) => {
      let angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (this.data.angle !== angle) {
        this.setData({
          angle: angle
        });
      }
    });
  }
});