// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {

  return  sendTemplateMessage(event)
}

//Mini消息推送
async function sendTemplateMessage(event) {
  const {
    OPENID
  } = cloud.getWXContext()

  const templateId = 'oqg9Sa3q37FeDg_C_11nfpkQefGgcffeaFlXGS1a56g'

  const sendResult = await cloud.openapi.templateMessage.send({

    touser: OPENID,
    templateId,
    formId: event.formId,
    page: 'pages/todo/todo',

    data: {
      //课程
      keyword1: {
        value: '1',
      },
      //班级
      keyword2: {
        value: '2',
      },
      //课程时间
      keyword3: {
        value: '3',
      },
    }

  })
  return sendResult
}