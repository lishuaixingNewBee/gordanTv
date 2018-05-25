// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String
    },
    titleColor: {
      type: String,
      value: '#000000'
    },
    logImage: {
      type: String
    },
    logName: {
      type: String
    },
    content: {
      type: String
    },
    contentColor: {
      type: String,
      value: '#888888'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    cancelCallback() {
      this.triggerEvent('cancel')
    },
    hide() {
      this.setData({
        show: false
      })
    },
    show() {
      this.setData({
        show: true
      })
    },
    onGotUserInfo(e) {
      this.triggerEvent('confirm', e)
    }
  }
})
