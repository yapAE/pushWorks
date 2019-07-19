// pages/techer/techer.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: ['天津市', '天津市', '津南区'],
    enrollment: [],
    classNumber: [],
    className: '',
    year:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let currentYear = new Date().getFullYear()
    let selectYears = [],i,j
    let classNumbers = [],u,v
    for (i = 2010; i <= currentYear; i++) {
      j = i + '年入学'
      selectYears = selectYears.concat(j)
    }
    for (u=1;u <= 20;u++){
      v = u + '班'
      classNumbers = classNumbers.concat(v)
    }
    this.setData({
      enrollment:selectYears,
      classNumbers:classNumbers
    })
    this.data.enrollment = selectYears
    this.data.classNumber = classNumbers
    console.log(this.data.enrollment)
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

  addClass(e){
    wx.showLoading({
      title: '提交中',
    })
    db.collection('classes').add({
      data:{
        region: this.data.region,
        shool: this.data.schoolName,
        class: this.data.className,
      }
    }).then(res =>{
      console.log(res)
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
      })
    })
  },
  //输入学校名
  inputSchoolName(e){
    this.data.schoolName = e.detail.value
  },

  //输入班级名
  inputClassName(e){
    this.data.className = e.detail.value
  },

  //地区选择
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  //年级选择
  ClassNumberChange(e){
    this.data.className = this.data.classNumbers[e.detail.value]
  },

  //入学和班级编号组合
  EnrollmentYearChange(e){
    console.log(this.data.enrollment[e.detail.value])
    this.data.year = this.data.enrollment[e.detail.value]
  }

})