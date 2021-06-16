// pages/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      number:"11",
      password:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  set_number:function(e){
    this.setData({
      number:e.detail.value
    })
  },
  set_password:function(e){
    this.setData({
      password:e.detail.value
    })
  },

  click_login:function(e){
    wx.request({
      url:'http://127.0.0.1:5000/login', 
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
          phone: this.data.number,
          password: this.data.password,
       },
       method: 'post',
       success: function (res) {
            console.log("发送成功");

       }
    })
    wx.request({
      url: 'http://127.0.0.1:5000/login',
      data:formData,
      method:'GET',
      header: { 'Content-Type': 'application/json' },
      success: function (res) {
        if(res.valid==0){
          wx.navigateTo({
            url: '/pages/main/main?ID=' + res.U_ID
          })

        }
        else{
          wx.showToast({
            title: '密码错误或该用户不存在！',
            icon: 'none',
            duration: 1500
        })
        }
      },
      fail:function(res){
        console.log("-------fail------")
      }
    })

  }
})