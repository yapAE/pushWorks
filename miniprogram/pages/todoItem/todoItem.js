// pages/todoItem/todoItem.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const util = require('../../util/date.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wid: '', //作业记录id
    classId: '',
    images: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    isFnish: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getWork(options.wid)
  },
//获取作业详情
  getWork(wid){
    db.collection('works').doc(wid).get().then(res =>{
      console.log(res.data.classId)
      this.isFnish(res.data.classId)

      this.setData({
        classId:res.data.classId,
        work: res.data,
        isCard: true,
        images:res.data.images,
      })
    }).catch(error =>{
      console.log(error)
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

  isFnish(classId){
    console.log(app.globalData.openid)
    console.log(this.data.classId)

    db.collection('works').where({
      _openid: app.globalData.openid,
      classId: classId,
      time: _.gt(util.todayStartTime()).and(_.lte(util.todayEndTime()))
    }).get().then(res =>{
      console.log(res)
      if(res.data.length > 0){
        this.setData({
          isFnish: true
        })
      }else{
        this.setData({
          isFnish: false
        })
      }
    })
  },
  //预览上传图片
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images // 需要预览的图片http链接列表
    })
  },

//做作业按钮
  toAssignment(e){
    wx.navigateTo({
      url: '/pages/assignment/assignment?pid=' + e.currentTarget.dataset.url + '&cid=' + e.currentTarget.dataset.cid,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '邀请您加入班级',
      desc: '分享页面的内容',
      path: '/pages/class/class?cid=' + this.data.classId// 路径，传递参数到指定页面,路径 
    }
  }
})