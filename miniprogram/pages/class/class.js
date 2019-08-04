// pages/class/class.js
const app = getApp()
const db = wx.cloud.database()
const login = require('../../util/login.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: '',
    openGid: '',
    realname: '',
    relationship: '0',
    isOut: true,
    logged: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      //设为true，获取ShareTicket
      withShareTicket: true
    })
    login.onGetOpenid()
    this.getClassInfo(options.cid)
    this.checkInClass(options.cid)

    this.setData({
      cid: options.cid,
    })
    console.log(this.data.cid)    
    console.log(app.globalData.openid) 
    //检测用户是否存在
    //查询用户是否存在用户表里
    db.collection('users').where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res.data[0])
      if (res.data.length == 0) {
        this.data.logged = false
      } else {
        this.data.logged = true
        app.globalData.avatarUrl = res.data[0].avatar
        app.globalData.nickName = res.data[0].nickName
      }
    })   
  },

  clickReload: function (e) {
    let that = this
    this.onGetUserInfo(e)

    wx.showLoading({
      title: '提交中',
    })

      //添加成员到班级
      db.collection('members').add({
        data:{
          classId: that.data.cid,
          avatarUrl: app.globalData.avatarUrl,
          realname: that.data.realname,
          relationship: that.data.relationship
        }
      }).then(res =>{
        this.setData({
          isOut: false
        })
        wx.hideLoading()
        wx.switchTab({
          url: '/pages/index/index',
        })
        wx.showToast({
          title: '提交成功',
        })

      })

  },
  //获取用户信息
   onGetUserInfo (e) {
    var userInfo = e.detail.userInfo
    app.globalData.avatarUrl = userInfo.avatarUrl
    app.globalData.nickName = userInfo.nickName
    //不存在则添加
    if (!this.data.logged) {
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
  //输入姓名
  inputYourName(e){
    this.setData({
      realname: e.detail.value
    })
  },
//获取班级基本信息
  getClassInfo(cid){
    db.collection('classes').doc(cid).get().then(res =>{
      console.log(res.data)
      this.setData({
        classInfo: res.data
      })
    })
  },

  //检查是否加入班级
  checkInClass(cid){
    db.collection('members').where({
      classId: cid
    }).get().then(res => {
      console.log(res.data)
      this.setData({
        members: res.data
      })
      //判断是否加入班级
      for(let index in res.data){
        if (res.data[index]._openid == app.globalData.openid) {
          console.log(app.globalData.openid)
          console.log(res.data[index]._openid)
          this.setData({
            isOut: false
          })
        } 
      }
      console.log(this.data.isOut)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '邀请您加入班级',
      desc:  '分享页面的内容',
      path:  '/pages/class/class?cid=' + this.data.cid // 路径，传递参数到指定页面,路径 /pages开始
    }
  },
//地区选择
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
})