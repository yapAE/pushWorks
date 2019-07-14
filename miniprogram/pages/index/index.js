//index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    is_in:0,
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
            console.log(res.userInfo)

            wx.setStorage({
              key: 'openid',
              data: this.onGetOpenid(),
              key: 'avatarUrl',
              data: res.userInfo.avatarUrl,
              key: 'nickName',
              data: res.userInfo.nickName,
            })

            console.log(wx.getStorageSync('nickName'))
            //查询用户是否存在用户表里
            db.collection('users').where({
              _openid: wx.getStorageSync('openid')
            }).get().then(result => {
              
              console.log(result.data.length)
              //不存在则添加
              if(result.data.length == 0){
              var user = db.collection('users').add({
                  data: {
                    avatar: res.userInfo.avatarUrl,
                    nickName: res.userInfo.nickName,
                    gender: res.userInfo.gender,
                  }
                }).then(add =>{
                  console.log(add)
                wx.setStorage({
                  key: 'userId',
                  data: add._id,
                })
                })
              }
            })
         
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                nickName: res.userInfo.nickName,
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('failed', err)
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
