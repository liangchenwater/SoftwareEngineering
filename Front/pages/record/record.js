// pages/record/record.js
const app = getApp()
var util=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    patient_id:"",
    doctor_id:"",
    Name:"小明",
    Gender:"男",
    Age:"20",
    Condition_Descrip:"",
    Medicine_Advice:"",
    pres_num:'2',
    pres_list:[
      {
        Medicine:"hello",
        Frequency_d:"1",
        Frequency_t:"3",
        Endtime:"2021-08-10 00:00:00",
        Dose:"1颗",
        Notes:""
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData(option.data);
    var that=this;
    wx.request({
      url: app.globalData.IP_address+'/userinfo', 
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
          U_ID: this.data.patient_id,
          identity: 'P',
       },
       method: 'POST',
       success: function (res) {
            console.log("userinfo发送成功");
            console.log(res.data.Age);
            console.log(res.data.Gender);
            that.setData({ 
              Name: res.data.U_Name, 
              Age: res.data.Age
            });
            if(res.data.Gender=='M')
            that.setData({Gender : '男'})
            else if(res.data.Gender=='F')
            that.setData({Gender : '女'})
            else
            that.setData({Gender : '其他'})
       },
       fail:function(res){
        console.log("发送失败");
      }
    })

    console.log(this.data.pres_list)

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

  }
})