// pages/top/top.js
const app = getApp()
const db = wx.cloud.database()
const format = require('../../util/date.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zan: false,
    images: [],
    TabCur: '',
    scrollLeft: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getClassList()

     db.collection('works').get().then(res =>{
       this.data.images = res.data
       console.log(this.data.images)

       this.setData({
         list: res.data,
       })
    })
  },

  //获取班级列表
  getClassList(){
    db.collection('members').where({
      _openid: app.globalData.openid
    }).field({
      classId: true,
      classname: true
    }).get().then(res => {
      console.log(res.data)
    this.setData({
      classes: res.data,
      TabCur: res.data[0].classId
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

  //Tab选择效果展示
  tabSelect(e) {
    this.data.TabCur = e.currentTarget.dataset.id
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
})