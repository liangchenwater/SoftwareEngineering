// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      name:"",
      number:"",
      password:"",
      items: [
        { name: 'doctor', value: '我是医生' },
        { name: 'patient', value: '我是患者', checked: 'true' }
      ]
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
  set_name:function(e){
    this.setData({
      name:e.detail.value
    })
  },

  click_register:function(e){
    wx.request({
      url:'http://127.0.0.1:5000/signup', 
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
          phone: this.data.number,
          password: this.data.password,
          name: this.data.name
       },
      method: 'post',
      success: function (res) {
            console.log("发送成功");
            if(res.state=='0'){
              wx.showToast({
                title: '注册成功！',
                icon: 'none',
                duration: 1500
              })
              wx.navigateTo({
                url: '/pages/main/main'
              })
            } 
            else{
              wx.showToast({
                title: '该用户已存在！',
                icon: 'none',
                duration: 1500
              })
            }
      },
      fail: function(res){
            console.log("-------fail------")
          }
        })
    
      }
    })