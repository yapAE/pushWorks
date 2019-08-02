var date = new Date();
var currentHours = date.getHours();
var currentMinute = date.getMinutes();
// pages/assignment/assignment.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cid: '',//classID,班级ID
    content: '',
    title: '',
    index: null,
    imgList: [],
    files: [],
    parentId: '',//作业id
    end_at:'请选择日期',
    multiArray: [['今天', '明天'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    multiIndex: [0, 0, 0],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cid)
    if(options.pid){
      this.setData({
        parentId: options.pid
      })
    }
    if (options.cid) {
      this.setData({
        cid: options.cid
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
      sourceType: ['album', 'camera'], //从相册选择
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

  //绑定标题数据
  bindInputTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },

//提交表单
  submitWork: function () {
    //表单验证
    if (this.data.title == ''){
       wx.showModal({
         title: '提示',
         content: '作业标题必须填写呢',
       })
       return false
    }
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

    this.data.end_at = (this.data.end_at == '请选择日期')?this.defaultEndTime():this.data.end_at;
    console.log(this.data.end_at)
    let EndAt = new Date(this.data.end_at).getTime()
    console.log(EndAt)

    Promise.all(promiseArr).then(res => {
      console.log(this.data.images)
      db.collection('works').add({
        data: {
          classId: this.data.cid,
          images: this.data.files,
          title: this.data.title,
          content: this.data.content,
          time: now,
          end_at: EndAt,
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


//dateChange

  pickerTap: function () {
    date = new Date();

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    // 月-日
    for (var i = 2; i <= 28; i++) {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + i);
      var md = (date1.getMonth() + 1) + "-" + date1.getDate();
      monthDay.push(md);
    }

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };

    if (data.multiIndex[0] === 0) {
      if (data.multiIndex[1] === 0) {
        this.loadData(hours, minute);
      } else {
        this.loadMinute(hours, minute);
      }
    } else {
      this.loadHoursMinute(hours, minute);
    }

    data.multiArray[0] = monthDay;
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;

    this.setData(data);
  },




  bindMultiPickerColumnChange: function (e) {
    date = new Date();

    var that = this;

    var monthDay = ['今天', '明天'];
    var hours = [];
    var minute = [];

    currentHours = date.getHours();
    currentMinute = date.getMinutes();

    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 把选择的对应值赋值给 multiIndex
    data.multiIndex[e.detail.column] = e.detail.value;

    // 然后再判断当前改变的是哪一列,如果是第1列改变
    if (e.detail.column === 0) {
      // 如果第一列滚动到第一行
      if (e.detail.value === 0) {

        that.loadData(hours, minute);

      } else {
        that.loadHoursMinute(hours, minute);
      }

      data.multiIndex[1] = 0;
      data.multiIndex[2] = 0;

      // 如果是第2列改变
    } else if (e.detail.column === 1) {

      // 如果第一列为今天
      if (data.multiIndex[0] === 0) {
        if (e.detail.value === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
        // 第一列不为今天
      } else {
        that.loadHoursMinute(hours, minute);
      }
      data.multiIndex[2] = 0;

      // 如果是第3列改变
    } else {
      // 如果第一列为'今天'
      if (data.multiIndex[0] === 0) {

        // 如果第一列为 '今天'并且第二列为当前时间
        if (data.multiIndex[1] === 0) {
          that.loadData(hours, minute);
        } else {
          that.loadMinute(hours, minute);
        }
      } else {
        that.loadHoursMinute(hours, minute);
      }
    }
    data.multiArray[1] = hours;
    data.multiArray[2] = minute;
    this.setData(data);
  },

  loadData: function (hours, minute) {

    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(this.formatNumber(i));
      }
      // 分
      for (var i = 0; i < 60; i += 10) {
        minute.push(this.formatNumber(i));
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(this.formatNumber(i));
      }
      // 分
      for (var i = minuteIndex; i < 60; i += 10) {
        minute.push(this.formatNumber(i));
      }
    }
  },

  loadHoursMinute: function (hours, minute) {
    // 时
    for (var i = 0; i < 24; i++) {
      hours.push(this.formatNumber(i));
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(this.formatNumber(i));
    }
  },

  loadMinute: function (hours, minute) {
    var minuteIndex;
    if (currentMinute > 0 && currentMinute <= 10) {
      minuteIndex = 10;
    } else if (currentMinute > 10 && currentMinute <= 20) {
      minuteIndex = 20;
    } else if (currentMinute > 20 && currentMinute <= 30) {
      minuteIndex = 30;
    } else if (currentMinute > 30 && currentMinute <= 40) {
      minuteIndex = 40;
    } else if (currentMinute > 40 && currentMinute <= 50) {
      minuteIndex = 50;
    } else {
      minuteIndex = 60;
    }

    if (minuteIndex == 60) {
      // 时
      for (var i = currentHours + 1; i < 24; i++) {
        hours.push(this.formatNumber(i));
      }
    } else {
      // 时
      for (var i = currentHours; i < 24; i++) {
        hours.push(this.formatNumber(i));
      }
    }
    // 分
    for (var i = 0; i < 60; i += 10) {
      minute.push(this.formatNumber(i));
    }
  },

  bindStartMultiPickerChange: function (e) {
    var that = this;
    var monthDay = that.data.multiArray[0][e.detail.value[0]];
    var hours = that.data.multiArray[1][e.detail.value[1]];
    var minute = that.data.multiArray[2][e.detail.value[2]];

    if (monthDay === "今天") {
      var month = date.getMonth() + 1;
      var day = date.getDate();
      monthDay = this.formatNumber(month) + "/" + this.formatNumber(day);
    } else if (monthDay === "明天") {
      var date1 = new Date(date);
      date1.setDate(date.getDate() + 1);
      monthDay = this.formatNumber((date1.getMonth() + 1)) + "/" + this.formatNumber(date1.getDate());
    
    } else {
      var month = monthDay.split("-")[0]; // 返回月
      var day = monthDay.split("-")[1]; // 返回日
      monthDay = this.formatNumber(month) + "/" + this.formatNumber(day);
    }
    console.log(this.defaultEndTime())
    //赋值给截止时间
    this.setData({
      end_at: date.getFullYear() + "/" + this.formatNumber(monthDay) + " " + this.formatNumber(hours) + ":" + this.formatNumber(minute) + ":00"
    })

  },
//默认作业截止时间，当天最后一秒
  defaultEndTime (){
   let currentYear = date.getFullYear(), currentMonth = date.getMonth() + 1, currentDay = date.getDate();
   let currentDateTime = currentYear + '/' + this.formatNumber(currentMonth) + '/' + this.formatNumber(currentDay) + ' 23:59:59'
   return currentDateTime
  },
  //日期格式化
  formatNumber (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
})