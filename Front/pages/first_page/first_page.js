// index.js
// 获取应用实例
const app = getApp()
Page({
  data: {
  },
  // 事件处理函数
  onShow() {
    var timerTem=setTimeout(
      function () {
        wx.redirectTo({
        url: '../log_reg_page/log_reg_page'
        })
        },2500)
}
})
