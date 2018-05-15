# 狗蛋TV

<p align="center">
  <img width="100" src="https://user-gold-cdn.xitu.io/2018/5/15/163622f528556b3d?w=290&h=290&f=png&s=10175">
</p>

狗蛋TV是基于微信小程序开发的一款App。gordanLee每天都会推荐一首歌、一篇文章、一段短视频，每天用十分钟的细碎时光，点燃内心的光明。目前分为音乐，短视频，影评三个模块。

![banner.png](https://user-gold-cdn.xitu.io/2018/5/15/163621cf53070049?imageView2/1/w/1304/h/734/q/85/format/webp/interlace/1)

- [线上开源地址](https://github.com/lishuaixingNewBee/gordanTv) https://github.com/lishuaixingNewBee/gordanTv 点个赞吧！
- [小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/)

![引导页](https://user-gold-cdn.xitu.io/2018/5/15/16363d00625d335a?w=267&h=474&f=gif&s=556913)

![音乐页](https://user-gold-cdn.xitu.io/2018/5/15/1635f631d527619f?w=267&h=474&f=gif&s=2425224)

![短视频页](https://user-gold-cdn.xitu.io/2018/5/15/1635f631d52e422c?w=267&h=474&f=gif&s=2739050)

![影评页](https://user-gold-cdn.xitu.io/2018/5/15/1635f631d5460ad5?w=267&h=474&f=gif&s=2924101)

![搜索页](https://user-gold-cdn.xitu.io/2018/5/15/1635f631d55a00f9?w=267&h=474&f=gif&s=1368594)


`以下所有 API 均由产品公司自身提供，本人皆从网络获取。获取与共享之行为或有侵犯产品权益的嫌疑。若被告知需停止共享与使用，本人会及时删除此页面与整个项目。请您暸解相关情况，并遵守产品协议。`

为了方便大家学习和测试，我们提供了https的接口供大家使用，且用且珍惜。请在微信开发设置中加入request合法域名,或者在开发设置中勾选——不校验合法域名、web-view（业务域名）、TLS 版本以及 HTTPS 证书。

### 感谢与支持
```
    -   ONE一个api: https://api.gordantv.top (服务端做的接口转发，所以有些慢)
    -   豆瓣api: https://douban.uieee.com
    -   QQ音乐api: https://c.y.qq.com
    -   快视频api: https://api.adline.com.cn
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
