// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = wx.cloud.database()
const  _ = db.command

// 云函数入口函数
//db,type,indexKey,data,condition,field,direction
exports.main = async (event, context) => {
  const targetDB = db.collection(event.db)

  try{
    if (event.type == "insert"){
      return  await targetDB.add({
        data: event.data
      })
    }

    if (event.type == "update"){
      return  await targetDB.doc(event.indexKey).update({
        data: event.data
      })
    }
    
    if (event.type == "delete"){
      return await  targetDB.where(event.condition).remove()
    }

    if (event.type == "get"){
      return await  targetDB.where(event.condition).get()
    } 

    if (event.type == "get_orderby") {
      return await  targetDB.orderBy(event.field,event.direction).get()
    }
  } catch(e) {
    console.error(e)
  }

}