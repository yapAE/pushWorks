// pages/list/list.js
const db = wx.cloud.database()
const app = getApp()
const util = require('../../util/date.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      today: false,
      openId: app.globalData.openid,
      myself: false
  },

  isToday(e){
    this.data.today = e.detail.value
    this.setData({
      today: e.detail.value
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    //以日期为Key
    if(this.today){
      var data = db.collection('works').where({
         date: nowDate
       })
    }else{
      var data = db.collection('works').where({
        _openid: app.globalData.openid
      }).orderBy('today','desc')
    }

     data.get().then(res => {
       console.log(res.data)
        this.setData({
          items: res.data
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

  }
})