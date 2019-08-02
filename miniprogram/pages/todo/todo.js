const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const util = require('../../util/date.js')
// pages/todo/todo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      classIds: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getClassIds()
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
//获取作业列表
  todoList(classIds){
    console.log(util.todayStartTime())
    db.collection('works').where({
     parentId: '', //作业任务类型
     classId: _.in(classIds),
    //  end_at: _.gt(util.todayStartTime()).and(_.lte(util.todayEndTime()))
     end_at: _.gt(util.todayStartTime()) //当日以后的作业列表
    }).get().then(res => {
      console.log(res.data)
      this.setData({
        todoList: res.data
      })
    }).catch(error => {
      console.log(error)
    })
    
  },
//获取classIds
  getClassIds(){
    let classIds = []
    db.collection('members').where({
      _openid: app.globalData.openid
    }).field('classId').get().then(res => {
        for (let index in res.data){
          classIds = classIds.concat(res.data[index].classId)
        }
        //查询列表
        this.todoList(classIds)
     }).catch(error=>{
      console.log(error)
    })
  }
})