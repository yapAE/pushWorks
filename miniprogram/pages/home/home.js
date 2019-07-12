// pages/home/home.js
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
Page({




  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    str: MONTHS[new Date().getMonth()],  // 月份字符串
    
    userTx: '',
    defaultUrl: '../../images/tx.png',
    username: '点击头像登录',
    userTx: '',
    
    info: false,
    bgiURL: '',
    avatarUrl: '',
    nickName: '',
  },

  // 点击启动页按钮，获取用户信息，初始化相册封面，获取最新动态
  getUserInfoHandler: function (e) {

    console.log(e)
    let d = e.detail.userInfo
    this.setData({
      userTx: d.avatarUrl,
      username: d.nickName
    })
    wx.setStorageSync('username', d.nickName)
    wx.setStorageSync('avatar', d.avatarUrl)

    const db = wx.cloud.database()
    const _ = db.command
    var userId = wx.getStorageSync('userId')
    if (!userId) {
      userId = this.getUserId()
    }
    db.collection('users').where({
      _openid: wx.getStorageSync('openId')
    }).get({
      success: res => {
        console.log(wx.getStorageSync('openId'))
        console.log('查询用户:', res)
        if (res.data && res.data.length > 0) {
          console.log('已存在')
          wx.setStorageSync('openId', res.data[0]._openid)
        } else {

          setTimeout(() => {
            db.collection('users').add({
              data: {
                userId: userId,
                iv: d.iv,
                nickName: d.nickName,
                avatarUrl: d.avatarUrl,
              },
              success: function () {
                wx.showToast({
                  title: '用户登录成功',
                })
                console.log('用户id新增成功')
                db.collection('users').where({
                  userId: userId
                }).get({
                  success: res => {
                    wx.setStorageSync('openId', res.data[0]._openid)
                  },
                  fail: err => {
                    console.log('用户_openid设置失败')
                  }
                })
              },
              fail: function (e) {
                console.log('用户id新增失败')
              }
            })
          }, 100)
        }
      },
      fail: err => {

      }
    })


  },

  getUserId: function () {
    var w = "abcdefghijklmnopqrstuvwxyz0123456789",
      firstW = w[parseInt(Math.random() * (w.length))];

    var userId = firstW + (Date.now()) + (Math.random() * 100000).toFixed(0)
    console.log(userId)
    wx.setStorageSync("userId", userId)

    return userId;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const days_count = new Date(this.data.year, this.data.month, 0).getDate();
        let days_style = new Array; 
        for(let i = 1; i <= days_count; i++) {
          const date = new Date(this.data.year, this.data.month - 1, i);
        if (date.getDay() == 0) {
          days_style.push({
            month: 'current', day: i, color: '#f488cd'
          });
        } else {
          days_style.push({
            month: 'current', day: i, color: '#a18ada'
          });
        }
      }
      days_style.push(
        { month: 'current', day: 12, color: 'white', background: '#b49eeb' },
        { month: 'current', day: 17, color: 'white', background: '#f5a8f0' },
        { month: 'current', day: 20, color: 'white', background: '#aad4f5' },
        { month: 'current', day: 1, color: 'white', background: '#84e7d0' },
      )
      this.setData({
        days_style
      });
      

}

})