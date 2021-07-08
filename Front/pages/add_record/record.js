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
    Name:"",
    Gender:"",
    Age:"",
    description:"",
    advice:"",
    pres_num:'0',
    pres_list:[
      {
      }
    ],
    today:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      patient_id:option.patient_id,
      doctor_id:app.globalData.U_ID,
      Name:option.Name,
      Gender:option.Gender,
      Age:option.Age,
      fu_time:""
    });
    var that=this
    that.setData({
      today:util.formatDate(new Date())
    })
    console.log(this.data.Name)
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
    console.log(this.data.medicine)

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

  add_medicine:function(){
    var that = this;
    var old = parseInt(this.data.pres_num)
    that.setData({
      pres_num:old+1
    })
    console.log(this.data.pres_num)
  },

  minus_medicine:function(){
    var that = this;
    var old = parseInt(this.data.pres_num)
    if(old>0){
    that.setData({
      pres_num:old-1
    })
  }
    console.log(this.data.pres_num)
  },

  set_describe:function(e){
    var that = this
    that.setData({
      description:e.detail.value
    })
  },

  set_advice:function(e){
    var that = this
    that.setData({
      advice:e.detail.value
    })
  },

  set_medicine_name:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['pres_list['+index+'].medicine']:e.detail.value
    })
  },

  set_dose:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['pres_list['+index+'].dose']:e.detail.value
    })
  },

  set_frequency_d:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['pres_list['+index+'].frequency_d']:e.detail.value
    })
  },

  set_frequency_t:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['pres_list['+index+'].frequency_t']:e.detail.value
    })
  },

  set_note:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['pres_list['+index+'].notes']:e.detail.value
    })
    console.log(this.data.pres_list[0].notes)
  },

  DateChange:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    console.log("data:"+index)
    that.setData({
      ['pres_list['+index+'].endtime']:e.detail.value
    })
    console.log(this.data.pres_list[0].endtime)
  },

  click_save:function(){
    console.log(this.data)
    wx.request({
      url:app.globalData.IP_address+'/addrecord', 
      header: { "ContentType": "application/json;charset=utf-8", },
      data: this.data,
      method: 'post',
      success: function (res) {
            console.log("发送成功");
      },
      fail: function(res){
            console.log("-------fail------")
          }
        })
  }

})