// pages/login.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      number:"",
      password:"",
      typeName: 'password',
      passFlag: 1,
      storePass: '',  // 暂存密码,用于显示密码
      width:"",
      height:""
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
    this.setData({width:app.windowWidth})
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
    url: app.globalData.IP_address+'/login', 
    header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
    data: {
        phone: this.data.number,
        password: this.data.password,
     },
     method: 'POST',
     success: function (res) {
          console.log("发送成功");
          console.log(res);
          if(res.data.valid=='0'){
            app.globalData.U_ID=res.U_ID;
            app.globalData.identity=res.identity;
            if(res.identity=='P'){
              wx.navigateTo({
                url: '/pages/main_patient/main?U_ID=' + res.U_ID + '&identity=' + res.identity
              })
            }
            else {
              wx.navigateTo({
                url: '/pages/main_doctor/main?U_ID=' + res.U_ID + '&identity=' + res.identity
              })
            }
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
      console.log("发送失败");
    }
  })
  },

  showPass(){     // 显示密码而非*号
    console.log(this.data.storePass)
    if (this.data.passFlag == 1){ // 第一次点击
      this.setData({ passFlag: 2, typeName : 'text'});
    }else{                        // 第二次点击
      this.setData({ passFlag: 1, typeName : 'password'});
    }
  }

})
