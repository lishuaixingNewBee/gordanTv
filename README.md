# 狗蛋TV

<p align="center">
  <img width="100" src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/163622f528556b3d~tplv-t2oaga2asx-image.image">
</p>

狗蛋TV是基于微信小程序开发的一款App。gordanLee每天都会推荐一首歌、一篇文章、一段短视频，每天用十分钟的细碎时光，点燃内心的光明。目前分为音乐，短视频，影评三个模块。

![banner.png](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/163621cf53070049~tplv-t2oaga2asx-image.image)

- [线上开源地址](https://github.com/lishuaixingNewBee/gordanTv) https://github.com/lishuaixingNewBee/gordanTv 点个赞吧！
- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/)

![引导页](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/16363d00625d335a~tplv-t2oaga2asx-image.image)

![音乐页](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/1635f631d527619f~tplv-t2oaga2asx-image.image)

![短视频页](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/1635f631d52e422c~tplv-t2oaga2asx-image.image)

![影评页](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/1635f631d5460ad5~tplv-t2oaga2asx-image.image)

![搜索页](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/5/15/1635f631d55a00f9~tplv-t2oaga2asx-image.image)


`以下所有 API 均由产品公司自身提供，本人皆从网络获取。获取与共享之行为或有侵犯产品权益的嫌疑。若被告知需停止共享与使用，本人会及时删除此页面与整个项目。请您暸解相关情况，并遵守产品协议。`

为了方便大家学习和测试，我们提供了https的接口供大家使用，且用且珍惜。请在微信开发设置中加入request合法域名,或者在开发设置中勾选——不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书。

### 感谢与支持
```
    -   狗蛋TVapi: https://api.gordantv.top
    -   豆瓣api: https://api.douban.com
    -   QQ音乐api: https://y.qq.com
```

###  项目介绍
狗蛋TV是基于微信小程序+ES6进行开发，能同时运行在Android、iOS环境下。涵盖了音乐、短视频、影评三个版块。
- 开屏引导图
    1. 调用微信wx.onAccelerometerChange重力感应设备API,实现水波荡漾。
    2. 调用wx.getUserInfo获取用户头像。
- 工具类
    1. 用Promise封装wx.request(),简化代码结构:
    
```
const $get = (url, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data,
      header: { 'Content-Type': 'json' },
      success: resolve,
      fail: reject
    })
  })
}
```

  2.  电影评分实现

```
const convertToStarsArray = (average) => {
  const LENGTH = 5;
  const CLS_ON = 'on'; // 全星
  const CLS_HALF = 'half'; // 半星
  const CLS_OFF = 'off'; // 无星
  let result = [];
  let score = Math.round(average) / 2;
  let hasDecimal = score % 1 !== 0
  let integer = Math.floor(score)
  for (let i = 0; i < integer; i++) {
    result.push(CLS_ON)
  }
  if (hasDecimal) {
    result.push(CLS_HALF)
  }
  while (result.length < LENGTH) {
    result.push(CLS_OFF)
  }
  return result;
}
```
    
- 小程序内部组件实现上拉刷新，下拉加载
```
    方法一：scroll-view 组件
    方法二：onPullDownRefresh和onReachBottom方法实现小程序下拉加载和上拉刷新
```

- 阅读模块

    1.  [微信小程序使用wxParse解析html](https://github.com/icindy/wxParse)
    ```
    项目中遇到在微信小程序里需要显示音乐文章的内容，文章内容是通过接口读取的服
    务器中的富文本内容，是html格式的，小程序默认是不支持html格式的内容显示的，
    那我们需要显示html内容的时候，就可以通过wxParse来实现。
    ```
### 项目安装
```
    git clone git@github.com:lishuaixingNewBee/gordanTv.git
```

### 目录结构
------
```shell
|--- utils & Public Function              通用函数
|--- components & components Public View  components和template模板
|--- images & Img Resources               图片资源
|--- pages & View Dir                     页面
```
### ○ 更新记录
#### 2018.5.17
```
    -   解决微信小程序中Date.parse()获取时间戳IOS不兼容的问题(IOS为NaN的问题)
```
#### 2018.5.25
```
    -   微信废弃 获取 wx.getUserInfo 接口后续将不再出现授权弹窗，升级为 <button class="getUserInfo_btn" open-type="getUserInfo" lang="zh_CN" bindgetuserinfo="onGotUserInfo">允许</button>
```

<p align="center">
  <img width="200" src="https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2019/8/27/16cd140d8008202a~tplv-t2oaga2asx-image.image">
</p>
