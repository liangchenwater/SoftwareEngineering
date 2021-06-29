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

    medicine0:"阿司匹林",
    medicine1:"感冒药",
    pres_num:'0',
    medicine:[
      {
        name:"",
        frequency_d:"1",
        frequency_t:"3",
        endtime:"2021-08-10 00:00:00",
        dose:"1颗",
        notes:""
      },
      {
        name:"",
        frequency_d:"",
        frequency_t:"",
        endtime:"",
        dose:"",
        notes:""
      }
    ]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    this.setData({
      patient_id:option.patient_id,
      Name:option.Name,
      Gender:option.Gender,
      Age:option.Age
    });
    var that=this;
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

    for(var i=0;i<that.data.pres_num;i++){
      var name=this.data.medicine0
      that.setData({
        ['medicine['+i+'].name']:this.data['medicine'+i],
        ['medicine['+i+'].frequency_d']:this.data['frequency_d'+i],
        ['medicine['+i+'].frequency_t']:this.data['frequency_t'+i],
        ['medicine['+i+'].endtime']:this.data['endtime'+i],
        ['medicine['+i+'].dose']:this.data['dose'+i],
        ['medicine['+i+'].notes']:this.data['notes'+i]
      })
    }
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
      ['medicine['+index+'].name']:e.detail.value
    })
  },

  set_dose:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['medicine['+index+'].dose']:e.detail.value
    })
  },

  set_frequency_d:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['medicine['+index+'].frequency_d']:e.detail.value
    })
  },

  set_frequency_t:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['medicine['+index+'].frequency_t']:e.detail.value
    })
  },

  set_note:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      ['medicine['+index+'].note']:e.detail.value
    })
  },

  DateChange:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    that.setData({
      ['medicine['+index+'].endtime']:e.detail.value+'00:00:00'
    })
  },

  click_save:function(){
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