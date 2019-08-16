
//获取用户的openid
const getData = (db,type,condition) => {
  // 调用云函数,获取openid
  wx.cloud.callFunction({
    name: 'curd',
    data: {
      db: db,
      type: type,
      condition: condition
    },
    success: res => {
      console.log(res.data)
      return res.data
    },
    fail: err => {
      console.error('failed', err)
    }
  })
}

module.exports = {
  getData: getData
}