// pages/appointment/appointment.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      date:'',
      doctor_name:'',
      doctor_id:'',
      start_time:0, //预约起始时间
      end_time:0,   //预约结束时间
      symptoms:'',        //主要症状
      notes:'',           //备注（可以为空）
      type:'A',

      array: ['初诊', '复诊'],
      index: 0,
      object_array:[
        {id: 0, name: '初诊'},
        {id: 1, name: '复诊'}
      ],

      start_array: ['08:00', '08:30','09:00','09:30','10:00','10:30','11:00','11:30',
      '14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30'],
      end_array: ['08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00',
      '14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00'],
      start_index:0,
      end_index:0,
      start_object_array:[
        {id:0,name:'08:00'}, {id:1,name:'08:30'}, {id:2,name:'09:00'}, {id:3,name:'09:30'},
        {id:4,name:'10:00'}, {id:5,name:'10:30'}, {id:6,name:'11:00'}, {id:7,name:'11:30'},
        {id:9,name:'14:00'}, {id:10,name:'14:30'}, {id:11,name:'15:00'},{id:12,name:'15:30'},
        {id:13,name:'16:00'},{id:14,name:'16:30'},{id:15,name:'17:00'},{id:16,name:'17:30'}
      ],
      end_object_array:[
        {id:1,name:'08:30'}, {id:2,name:'09:00'}, {id:3,name:'09:30'}, {id:4,name:'10:00'}, 
        {id:5,name:'10:30'}, {id:6,name:'11:00'}, {id:7,name:'11:30'}, {id:8,name:'12:00'},
        {id:10,name:'14:30'},{id:11,name:'15:00'},{id:12,name:'15:30'},{id:13,name:'16:00'},
        {id:14,name:'16:30'},{id:15,name:'17:00'},{id:16,name:'17:30'},{id:17,name:'18:00'}
      ]


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      doctor_id:options.key1,
      doctor_name:options.key2 
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

  set_is_first_time:function(e){
    this.setData({index:e.detail.value});
    if(e.detail.value==0){
      this.setData({ type:'A'})
    }
    else{
      this.setData({ type:'P'})
    }
    
  },
  set_doctor:function(e){
  },
  set_start_time:function(e){
    var i = Number(e.detail.value)
    if(i>=8)i=i+1;
    this.setData({start_index:i})
    this.setData({end_index:i})
    console.log(this.data.start_index+' '+this.data.end_index);
  },
  set_end_time:function(e){
    this.setData({
      end_index:e.detail.value
    })
  },
  set_symptom:function(e){
    this.setData({
      symptoms:e.detail.value
    })
  },
  set_note:function(e){
    this.setData({
      notes:e.detail.value
    })
  },

  mydata:function(e){ //可获取日历点击事件
    this.setData({
      date: e.detail.data
    });
   },


  click_appointment:function(e){
    if(this.data.symptoms == '') {
      wx.showToast({
        title: '未填写症状描述！',
        icon: 'none',
        duration: 1500
      })
    }
    else if(this.data.date == '') {
      wx.showToast({
        title: '未填写日期！',
        icon: 'none',
        duration: 1500
      })
    }
    else{
      if(this.data.notes != '') {
        this.setData({symptoms:this.data.symptoms+'（备注：'+this.data.notes+'）'})
      }
      console.log(this.data.type+' '+this.data.date+' '+this.data.start_index);
      console.log(this.data)
      wx.request({
      url: app.globalData.IP_address+'/addappointment', 
      header: { "ContentType": "application/json;charset=utf-8" },

      data: {
          patient_id: app.globalData.U_ID,
          doctor_id: this.data.doctor_id, //应该连接到通讯录那边去选择？
          date: this.data.date,
          time: this.data.start_index,
          description:this.data.symptoms,
          type: this.data.type //初诊：A，复诊：P
        },
        method: 'POST',
        success: function (res) {
            console.log("发送成功");
            console.log(res);
            if(res.data.valid=='-1'){ //后端返回：数据是否填写正确？
              wx.showToast({
                title: '该预约时间已满',
                icon: 'none',
                duration: 1500
            })
            }
            else {
              wx.showToast({
                title: '预约成功',
                icon: 'none',
                duration: 1500
            })
            }
        },
        fail:function(res){
        console.log("发送失败");
      }
    })
    }
    
   },

})