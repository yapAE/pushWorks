//index.js
const app = getApp()
const db = wx.cloud.database()
const img = require('../../util/nologin.js')
Page({
  data: {
    avatarUrl: img.nologin(),
    username: '点击头像登陆',
    logged:false,
  },
//初始
  onLoad: function() {
    this.onGetOpenid()
  //查询用户是否存在用户表里
    db.collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res =>{
      console.log(res.data[0])
      if (res.data.length == 0){
        this.data.logged = false
      }else{
        this.setData({
          avatarUrl: res.data[0].avatar,
          username: res.data[0].nickName,
          badgeCount: res.data[0].badgeCount,
          zanCount: res.data[0].zanCount,
          pointsCount: res.data[0].pointsCount
        })
        app.globalData.avatarUrl = res.data[0].avatar
        app.globalData.nickName = res.data[0].nickName
      }
    })

  },
  // 获取用户信息
  onGetUserInfo: function(e) {
    console.log(e)
    var userInfo = e.detail.userInfo
    this.setData({
        username: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        logged: true,
    })
    app.globalData.avatarUrl = userInfo.avatarUrl
    app.globalData.nickName = userInfo.nickName
        //不存在则添加
        if (this.data.logged) {
          db.collection('users').add({
            data: {
              //字段还需添加
              avatar: userInfo.avatarUrl,
              nickName: userInfo.nickName,
              gender: userInfo.gender,
              badgeCount: 1,
              zanCount: 0,
              pointsCount: 10
            }
          }).then(add => {
            console.log(add)
          })
        }
  },

  onGetOpenid: function() {
    // 调用云函数,获取openid
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('failed', err)
      }
    })
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: '邀请您加入班级',
      desc: '分享页面的内容',
      path: '/pages/class/class?cid=25c59b425d37cc67014042d3044b9de6' // 路径，传递参数到指定页面,路径 /pages开始
    }
  }
})


