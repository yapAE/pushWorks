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

  onLoad: function() {
    this.onGetOpenid()
    this.setData({
      avatarUrl: this.data.avatarUrl,
      username: this.data.username,
      logged:this.data.logged,
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

      //查询用户是否存在用户表里
      db.collection('users').where({
        _openid: app.globalData.openid
      }).get().then(result => {

        console.log(result.data.length)
        //不存在则添加
        if (result.data.length == 0) {
          var user = db.collection('users').add({
            data: {
              avatar: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName,
              gender: res.userInfo.gender,
            }
          }).then(add => {
            console.log(add)
          })
        }
      })
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
})
