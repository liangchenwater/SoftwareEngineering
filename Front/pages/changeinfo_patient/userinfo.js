// pages/userinfo_doctor/userinfo.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    U_Name:"李亮",
    Gender:"男",
    Age:"21",
    Phone:"188889189031",
    array: ['男', '女', '其他'],
    index: 0,

    open: false,
    // mark 是指原点x轴坐标
    mark: 0,
    // newmark 是指移动的最新点的x轴坐标 
    newmark: 0,
    istodown: true,
    istoup: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.request({
      url: app.globalData.IP_address+'/userinfo', 
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
          U_ID: app.globalData.U_ID,
          identity: 'P'
       },
       method: 'POST',
       success: function (res) {
            console.log("userinfo发送成功");
            that.setData(res.data);
            if(res.data.Gender=='M'){
              that.setData({
                Gender:'男'
              })
            }
            else if(res.data.Gender=='F'){
              console.log(that.data.Gender)
              that.setData({
                Gender:'女'
              })
            }
            else{
              {
                that.setData({
                  Gender:'其他'
                })
              }
            }
       },
       fail:function(res){
        console.log("userinfo发送失败");
      }
    })
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

  // 点击图标事件
  tap_ch: function(e) {
    if (this.data.open==false) {
        this.setData({
            open: true
        });
    } else {
        this.setData({
            open: false
        });
    }
},

tap_start: function(e) {
  console.log("tap_start")
    // touchstart事件
    // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
    this.data.mark = this.data.newmark = e.touches[0].pageY;
},

tap_drag: function(e) {
    // touchmove事件
    this.data.newmark = e.touches[0].pageY;
   
    // 手指从上向下移动
    if (this.data.mark < this.data.newmark&&this.data.mark<100) {
        this.istodown = true;
        console.log("change_true")
    }
    
    // 手指从下向上移动
    if (this.data.mark > this.data.newmark ) {
        this.istoup = true;
    }
    this.data.mark = this.data.newmark;
},

tap_end: function(e) {
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    // 通过改变 opne 的值，让主页加上滑动的样式
    if (this.istodown && this.data.open==false) {
        this.setData({
            open: true
        });
    } else if(this.istoup && this.data.open==true) {
        this.setData({
            open: false
        });
    }
},
tap_info: function(e){
  wx.navigateTo({
    url: '/pages/changeinfo_patient/userinfo'
  })
},

tap_friend: function(e){
  wx.navigateTo({
    url: '/pages/AddressbookP/AddressbookP'
  })
},

tap_logout:function(e){
  app.globalData.U_ID="";
  app.globalData.identity="";
  wx.navigateTo({
    url: '/pages/login/login'
  })
},

tap_record: function(e){
  wx.navigateTo({
    url: '/pages/record_list_patient/record'
  })
},

set_U_Name:function(e){
  this.setData({
    U_Name:e.detail.value
  })
},

set_Age:function(e){
  this.setData({
    Age:e.detail.value
  })
},

set_Gender:function(e){
  var that=this
  console.log(e.detail.value);
    that.setData({
      Gender:that.data.array[e.detail.value]
    })
},

click_send:function(){
  var gender
  if(this.data.Gender=='男'){
    gender='M'
  }
  else if(this.data.Gender=='女'){
    gender='F'
  }
  else gender='O'
  wx.request({
    url: app.globalData.IP_address+'/modinfo', 
    header: { "ContentType": "application/json;charset=utf-8", },
    data: {
        uid: app.globalData.U_ID,
        identity: 'P',
        new_name: this.data.U_Name,
        new_gender: gender,
        new_age: this.data.Age
     },
     method: 'POST',
     success: function (res) {
          console.log("modinfo发送成功");
     },
     fail:function(res){
      console.log("modinfo发送失败");
    }
  })
}

})