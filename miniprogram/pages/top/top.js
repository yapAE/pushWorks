// pages/top/top.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const util = require('../../util/date.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zan: false,
    images: [],
    cid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTop(options.pid)
  },
//top
  getTop(pid){
    console.log(pid)
    db.collection('works').where({
      parentId: pid,
      time: _.gt(util.todayStartTime()).and(_.lte(util.todayEndTime()))
    }).get().then(res => {
      this.data.images = res.data
      console.log(this.data.images)

      this.setData({
        list: res.data,
      })
    })
  },
  isZan(e){
    this.data.zan = e.detail.value
  },
  //预览作业图片
  previewImage(e) {
    console.log(e)
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: e.target.dataset.src // 需要预览的图片http链接列表
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

  },

    // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  //setZan 点赞
  setZan (e) {
    console.log(e)
    db.collection('works').doc(e.currentTarget.dataset.wid).update({
      data:{
        zan: +1
      }
    }).then(res =>{
      console.log(res)
    })
  }

})