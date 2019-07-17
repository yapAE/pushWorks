const db = wx.cloud.database()
const app = getApp()
//const dateFormat = require('../../util/date.js')
Page({
  data: {
    text: '',
    images: [],
    files: [],
  },

  submit:function(){
    wx.showLoading({
      title: '提交中',
    })
    //定义一个上传数组
    const promiseArr = []

    for (let i = 0; i< this.data.images.length; i++){
      let filePath = this.data.images[i]
      let siffix = /\.[^\.]+$/.exec(filePath)[0];//获取文件扩展名

      promiseArr.push(new Promise((reslove,reject)=>{

        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + siffix,
          filePath: filePath, //文件路径
        }).then(res =>{
          //get Resource Id
          console.log(this.data.images)
          console.log(res.fileID)
          //将返回的数据计入files[]
          this.data.files = this.data.files.concat(res.fileID)
          console.log(this.data.files)

          reslove()
        }) .catch(error => {
          console.log(error)
        })

      }))
    }
//时间
    var now = new Date();

    Promise.all(promiseArr).then(res=>{
      console.log(this.data.images)
      db.collection('works').add({
        data:{
          images: this.data.files,
          text: this.data.text,
          today: now,
          nickName: app.globalData.nickName,
          avatarUrl: app.globalData.avatarUrl,
          //异步上传，结束才赋值
        }
      })
      .then(res=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
        })
        this.setData({
          images:[],
          text: ''
        })
        wx.navigateTo({
          url: '../list/list',
        })
      })
      .catch(error =>{
        console.log(error)
      })
    })
  },

  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          images: that.data.images.concat(res.tempFilePaths)
        });
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
  //删除选中预览图片
  deleteImg(e){
    let images = this.data.images;
    let index = e.currentTarget.dataset.index;
    images.splice(index,1);
    this.setData({
      images:images
    })
  },

  bindInputText(e){
      this.data.text = e.detail.value
  }

});