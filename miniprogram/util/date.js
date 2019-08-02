const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const todayEndTime = () => {
  var todayYear = (new Date()).getFullYear();
  var todayMonth = (new Date()).getMonth();
  var todayDay = (new Date()).getDate();
  var todayTime = (new Date(todayYear, todayMonth, todayDay, '23', '59', '59')).getTime();//毫秒
  return todayTime;
}

const todayStartTime = () => {
  const date = new Date();
  let currentYear = date.getFullYear(), currentMonth = date.getMonth() + 1, currentDay = date.getDate();
  let currentDateStartTime = currentYear + '/' + formatNumber(currentMonth) + '/' + formatNumber(currentDay) + ' 00:00:00'
  let unixTime = new Date(currentDateStartTime).getTime()
  return unixTime
}

const testDate = dateStr => {
  // date : y-m-d
  var date = new Date();
  dateStr = dateStr.toString();
  const year = date.getFullYear()
  let d = [];
  if (dateStr.length > 0) {
    d = dateStr.split("-");
    if (d[0] >= year)
      return false;
  }
  return true;
}


const typeC = (o) => {
  var str = Object.prototype.toString.call(o);
  return str.match(/\[object (.*?)\]/)[1].toLowerCase();
}

var getTip = function (date) {
  var dateNow = new Date();
  var date = new Date(date);
  var timer = (dateNow - date) / 1000
  var tip = ''
  if (timer <= 0) {
    tip = '刚刚'
  } else if (Math.floor(timer / 60) <= 0) {
    tip = '刚刚'
  } else if (timer < 3600) {
    tip = Math.floor(timer / 60) + '分钟前'
  } else if (timer >= 3600 && (timer <= 86400)) {
    tip = Math.floor(timer / 3600) + '小时前'
  } else if (timer / 86400 <= 31) {
    tip = Math.ceil(timer / 86400) + '天前'
  } else {
    tip = '几光年以前~~'
  }
  return tip
}

module.exports = {
  formatTime: formatTime,
  testDate: testDate,
  typeC: typeC,
  getTip: getTip,
  todayStartTime: todayStartTime,
  todayEndTime: todayEndTime
}