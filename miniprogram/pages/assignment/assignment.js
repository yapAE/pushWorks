// pages/assignment/assignment.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    title: '',
    index: null,
    imgList: [],
    files: [],
    parentId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.pid)
    if(options.pid){
      this.setData({
        parentId: options.pid
      })
    }


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


  ChooseImage() {
    wx.chooseImage({
      count: 4, //默认9
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '要从列表里删除这张图片吗？',
      cancelText: '取消',
      confirmText: '确认',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  bindInputContent(e) {
    this.setData({
      content: e.detail.value
    })
  },

//提交表单
  submit(){
    wx.showLoading({
      title: '提交中...',
    })
  //上传图片
  const  PromiseArr = []

    PromiseArr.push(this.uploadImg())
    Promise.all(PromiseArr).then(res =>{
      this.pushData().then(re => {
        this.setData({
          imgList: [],
          title: '',
          content: ''
        })
        wx.hideLoading()
        wx.showToast({
          title: '作业布置完毕',
        })
      })
    })

    console.log(this.data.files)
  },
  //图片上传
  uploadImg(){
    for (let image in this.data.imgList) {
        let filePath = this.data.imgList[image]
        let siffix = /\.[^\.]+$/.exec(filePath)[0];//获取文件扩展名
      new Promise((resolve, reject) => {
        var now = new Date().getTime()
        wx.cloud.uploadFile({
          cloudPath: now + siffix,
          filePath: filePath
        }).then(res => {
       //   console.log(res.fileID)
          this.data.files = this.data.files.concat(res.fileID)
          console.log(this.data.files)
          resolve()
        }).catch(error=>{
          console.log(error)
        })
      })
    }
  },

  //数据入库
  pushData(){
   return new Promise((resolve,reject)=>{
      db.collection('works').add({
        data: {
          avatarUrl: app.globalData.avatarUrl,
          title: this.data.title,
          content: this.data.content,
          images: this.data.files,
          parentId: this.data.parentId,
          time: new Date().getTime()
        }
      }).then(res =>{
       // console.log(res.data)
        resolve()
      }).catch(error =>{
        console.log(error)
      })
    })

  },
  //绑定标题数据
  bindInputTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },

  submitWork: function () {
    wx.showLoading({
      title: '提交中',
    })
    //定义一个上传数组
    const promiseArr = []

    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let siffix = /\.[^\.]+$/.exec(filePath)[0];//获取文件扩展名

      promiseArr.push(new Promise((reslove, reject) => {

        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + siffix,
          filePath: filePath, //文件路径
        }).then(res => {
          //get Resource Id
          console.log(this.data.imgList)
          console.log(res.fileID)
          //将返回的数据计入files[]
          this.data.files = this.data.files.concat(res.fileID)
          console.log(this.data.files)

          reslove()
        }).catch(error => {
          console.log(error)
        })

      }))
    }
    //时间
    var now = new Date().getTime();

    Promise.all(promiseArr).then(res => {
      console.log(this.data.images)
      db.collection('works').add({
        data: {
          images: this.data.files,
          title: this.data.title,
          content: this.data.content,
          time: now,
          nickName: app.globalData.nickName,
          avatarUrl: app.globalData.avatarUrl,
          parentId: this.data.parentId,
          //异步上传，结束才赋值
        }
      })
        .then(res => {
          console.log(res)
          wx.hideLoading()
          wx.showToast({
            title: '提交成功',
          })
          this.setData({
            imgList: [],
            title: ''
          })

        })
        .catch(error => {
          console.log(error)
        })
    })
  },

})