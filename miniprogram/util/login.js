const db = wx.cloud.database()
const app = getApp()
//检测用户是否注册
const checkUser = () => {
  db.collection('users').where({
    _openid: app.globalData.openid
  }).get().then(res => {
    console.log(res.data[0])
    if (res.data.length == 0) {
      app.globalData.logged = false
    } else {
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
}

//获取用户的openid
  const onGetOpenid =() => {
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
  }

// 获取用户信息
const onGetUserInfo = e => {
  console.log(e)
  var userInfo = e.detail.userInfo
  app.globalData.avatarUrl = userInfo.avatarUrl
  app.globalData.nickName = userInfo.nickName
  //不存在则添加
  if (app.globalData.logged) {
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
}

    module.exports = {
      onGetOpenid: onGetOpenid,
      checkUser: checkUser,
      onGetUserInfo: onGetUserInfo
    }