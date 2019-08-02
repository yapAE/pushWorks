// pages/class/class.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: '',
    openGid: '',
    realname: '',
    relationship: '0',
    isOut: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showShareMenu({
      //设为true，获取ShareTicket
      withShareTicket: true
    })
    this.getClassInfo(options.cid)
    this.checkInClass(options.cid)

    this.setData({
      cid: options.cid,
    })
    console.log(this.data.cid)    
  },

  clickReload: function () {
    let that = this
    
    wx.showLoading({
      title: '提交中',
    })
    app.getShareTiket(function (globalData) {
      console.log('clickReload---globalData-->' + JSON.stringify(globalData))
      //添加成员到班级
      db.collection('members').add({
        data:{
          classId: that.data.cid,
          openGid: globalData.openGid,
          avatarUrl: '',
          realname: that.data.realname,
          relationship: that.data.relationship
        }
      }).then(res =>{
        wx.showToast({
          title: '提交成功',
        })
      })
      that.setData({
        openGid: globalData.openGid
      })
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
          this.data.isOut = false
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