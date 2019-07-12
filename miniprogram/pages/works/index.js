const db = wx.cloud.database()
Page({
  data: {
    files: [],
    text: '',
    images: [],
    baseData: []
  },


  submit:function(){
    wx.showLoading({
      title: '提交中',
    })
    const promiseArr = []

    for (let i = 0; i< this.data.files.length; i++){
      let filePath = this.data.files[i]
      let siffix = /\.[^\.]+$/.exec(filePath)[0];//获取文件扩展名

      promiseArr.push(new Promise((reslove,reject)=>{

        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + siffix,
          filePath: filePath, //文件路径
        }).then(res =>{
          //get Resource Id
          console.log(res.fileID)

          this.setData({
            images: this.data.images.concat(res.fileID)
          })
          reslove()
        }) .catch(error => {
          console.log(error)
        })

      }))
    }
//以日期为Key
let now = new Date();
let yearMonth = now.getFullYear() + now.getMonth();
let day = now.getDay();

    Promise.all(promiseArr).then(res=>{
      db.collection('works').add({
        data:{
          images: this.data.images,
          text: this.data.text,
          today:  now
          //异步上传，结束才赋值
        }
      })
      .then(res=>{
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
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
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  bindInputText(e){
      this.data.text = e.detail.value
  }

});