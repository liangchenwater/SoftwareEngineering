// pages/user_data.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uid:"11",
        identity:"",
        new_name:"",
        new_gender:"",
        new_age:20,
        new_title:"",
        new_department:"",
        new_work_time:""
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
  
    set_name:function(e){
      this.setData({
        new_name:e.detail.value
      })
    },
    set_gender:function(e){
      this.setData({
        new_gender:e.detail.value
      })
    },
    set_age:function(e){
        this.setData({
          new_age:e.detail.value
        })
    },
    set_title:function(e){
        this.setData({
          new_title:e.detail.value
        })
    },
    set_department:function(e){
        this.setData({
          new_department:e.detail.value
        })
    },
    set_work_time:function(e){
        this.setData({
          new_work_time:e.detail.value
        })
    },

  
    click_login:function(e){
      wx.request({
        url:'http://127.0.0.1:5000/modinfo', 
        header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        data: {
            //uid: ???,
            identity: this.data.identity,
            new_name: this.data.new_name,
            new_gender: this.data.new_gender,
            new_age: this.data.new_age,
            new_title: this.data.new_title,
            new_department: this.data.new_department,
            new_work_time: this.data.new_work_time,
         },
         method: 'post',
         success: function (res) {
              console.log("发送成功");
  
         }
      })
      wx.request({
        url: 'http://127.0.0.1:5000/userinfo',
        data: { 
            //U_ID: ???,
            identity: "P"
        },
        method:'POST',
        header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        success: function (res) {
            console.log("发送成功");
        }
      })
      wx.request({
        url: 'http://127.0.0.1:5000/userinfo',
        data:formData,
        method:'GET',
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
            this.data.new_name = res.U_Name
            this.data.new_gender = res.Gender
            this.data.new_age = res.Age
            this.data.new_title = res.Title
            this.data.new_department = res.Department
            this.data_new_work_time = res.Work_Time
        },
        fail:function(res){
          console.log("-------fail------")
        }
      })
  
    }
  })