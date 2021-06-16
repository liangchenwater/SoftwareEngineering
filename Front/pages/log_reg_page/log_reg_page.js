// logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad() {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return {
          date: util.formatTime(new Date(log)),
          timeStamp: log
        }
      })
    })
  },
  go_register: function(){
    wx.navigateTo({
      url: '/pages/register/register'//跳转
    })
  },
  go_login:function(){
    wx.navigateTo({
      url: '/pages/login/login'//跳转
    })
  }
})


