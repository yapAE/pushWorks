// pages/member/member.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TabCur: '0', //0代表学生，1代表教师，2代表家长
    scrollLeft: 0,
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: '布置作业',
      url: "../assignment/assignment?cid="
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '检查作业',
      url: "../assignment/assignment?cid="

    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '邀请同学',
      url: 'botton'
    }],
    gridCol: 3,
    classId: ''
  },
//Tab选择效果展示
  tabSelect(e) {
    this.data.TabCur = e.currentTarget.dataset.id
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
    this.getMembers(e.currentTarget.dataset.id)

    wx.showShareMenu({
      //设为true，获取ShareTicket
      withShareTicket: true
    })
  },

  //获取成员
  getMembers(num){
    console.log(this.data.classId)
    console.log(num)
    db.collection('members').where({
      classId: this.data.classId,
      relationship:num
    }).get().then(res =>{
      console.log(res.data)
      this.setData({
        list:res.data
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // this.data.classId = options.cid

   this.setData({
     classId: options.cid
   })

    this.getMembers(this.data.TabCur)

    console.log(this.data.classId)
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
      desc: '分享页面的内容',
      path: '/pages/class/class?cid=' + this.data.classId// 路径，传递参数到指定页面,路径 
    }
  }
})