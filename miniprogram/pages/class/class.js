// pages/class/class.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['天津市', '天津市', '津南区'],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.showShareMenu({
      //设为true，获取ShareTicket
      withShareTicket: true
    })
  },

  clickReload: function () {
    let that = this
    app.getShareTiket(function (globalData) {
      console.log('clickReload---globalData-->' + JSON.stringify(globalData))
      that.setData({
        openGid: globalData.openGid
      })
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
      path:  '/pages/class/class' // 路径，传递参数到指定页面,路径 /pages开始
    }
  },
//地区选择
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
})