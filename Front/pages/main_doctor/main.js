// pages/main/main.js
const app = getApp()
var util=require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      Name:'',
      Department:'',
      Title:'',
      remind:[
      { Event_ID:"", 
        Event_Type:"F",
        Event_Time:"2021-06-25 00:00:00",
        Complete:'N',
        name:"阿司匹林",
        info1:"1片",
        info2:"1天2次",
        info3:"",
        show:false },
        { Event_ID:"", 
        Event_Type:"F",
        Event_Time:"2021-06-25 00:00:00",
        Complete:'N',
        name:"阿司匹林",
        info1:"1片",
        info2:"1天2次",
        info3:"",
        show:false },
        { Event_ID:"", 
        Event_Type:"F",
        Event_Time:"2021-06-25 00:00:00",
        Complete:'N',
        name:"阿司匹林",
        info1:"1片",
        info2:"1天2次",
        info3:"",
        show:false },
        { Event_ID:"", 
        Event_Type:"F",
        Event_Time:"2021-06-25 00:00:00",
        Complete:'N',
        name:"阿司匹林",
        info1:"1片",
        info2:"1天2次",
        info3:"",
        show:false }
      ],
      date:'',

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
  onLoad: function () {
    var that = this;
    var DATE = util.formatDate(new Date());
    this.setData({
      date: DATE,
    });
    wx.request({
      url: app.globalData.IP_address+'/userinfo', 
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: {
          U_ID: app.globalData.U_ID,
          identity: app.globalData.identity,
       },
       method: 'POST',
       success: function (res) {
            console.log("userinfo发送成功");
            console.log(res.data.Age);
            console.log(res.data.Gender);
            that.setData({ 
              Name: res.data.U_Name, 
              Department: res.data.Department,
              Title: res.data.Title
            });
       },
       fail:function(res){
        console.log("userinfo发送失败");
      }
    })

    wx.request({
      //等待填充
      url: app.globalData.IP_address+'/displaycalender', 
      header: { "ContentType": "application/json;charset=utf-8", },
      data: {
          u_id: app.globalData.U_ID,
          begin: that.data.date+" 00:00:00",
          end: that.data.date+" 23:59:59"
       },
       method: 'POST',
       success: function (res) {
            console.log("calender发送成功");
            console.log(res.data);
            that.setData({ 
                remind:res.data
            });
       },
       fail:function(res){
        console.log("calender发送失败");
      }
    })
    var that=this;
    for(var i in that.data.remind){
    　　if(that.data.remind[i].Event_Type!='M'){

          that.setData({ 
            ['remind['+i+'].Name']:'xiaoming', 
            ['remind['+i+'].Age']: '15',
            ['remind['+i+'].Gender']: 'nan',
            ['remind['+i+'].Phone']: '199902030131'
          });

        wx.request({
          url: app.globalData.IP_address+'/userinfo', 
          header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
          data: {
              U_ID: that.data.remind[i].info2,
              identity: 'P',
          },
          method: 'POST',
          success: function (res) {
                console.log("sub_userinfo发送成功");
                that.setData({ 
                  ['remind['+i+'].Name']:res.data.Name, 
                  ['remind['+i+'].Age']: res.data.Age,
                  ['remind['+i+'].Gender']: res.data.Gender,
                  ['remind['+i+'].Phone']: res.data.Phone
                });
          },
          fail:function(res){
            console.log("sub_user发送失败");
          }
        })
    }
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.globalData.U_ID==""){
      wx.showToast({
        title: '请先登录！',
        icon: 'none',
        duration: 1500
    })
    setTimeout(
      function () {
        wx.redirectTo({
        url: '/pages/login/login'
        })
        },1500)
    }
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


  mydata:function(e){ //可获取日历点击事件
    var that=this;
    this.setData({
      date: e.detail.data
    });
    console.log(this.data.date)
    wx.request({
      //等待填充
      url: app.globalData.IP_address+'/displaycalender', 
      header: { "ContentType": "application/json;charset=utf-8", },
      data: {
          u_id:app.globalData.U_ID,
          begin: that.data.date+" 00:00:00",
          end: that.data.date+" 23:59:59"
       },
       method: 'POST',
       success: function (res) {
            console.log("发送成功");
            console.log(res.data);
            that.setData({ 
                remind:res.data
            });
       },
       fail:function(res){
        console.log("发送失败");
      }
    })

    var that=this;
    for(var i in that.data.remind){
    　　if(that.data.remind[i].Event_Type!='M'){
        wx.request({
          url: app.globalData.IP_address+'/userinfo', 
          header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
          data: {
              U_ID: that.data.remind[i].info2,
              identity: 'P',
          },
          method: 'POST',
          success: function (res) {
                console.log("sub_userinfo发送成功");
                that.setData({ 
                  ['remind['+i+'].Name']:res.data.Name, 
                  ['remind['+i+'].Age']: res.data.Age,
                  ['remind['+i+'].Gender']: res.data.Gender,
                  ['remind['+i+'].Phone']: res.data.Phone
                });
          },
          fail:function(res){
            console.log("sub_user发送失败");
          }
        })
    }
    }
   },


   pull_menu:function(){
     console.log("pull")
   },

   listBtn:function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    let currect = "remind["+index+"].show"
    if (that.data.remind[index].show === true) {
      console.log("隐藏")
      that.setData({
        [currect]: false
      })
    } else{
      console.log("显示")
      that.setData({
        [currect]: true
      })
    }
  },

  finishBtn:function (e) {
    var that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    let currect = "remind["+index+"].Complete"
    if (that.data.remind[index].Complete === true) {
      that.setData({
        [currect]: false
      })
    } else{
      that.setData({
        [currect]: true
      })
    }
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
          url: '/pages/changeinfo_doctor/userinfo'
        })
      },
      tap_friend: function(e){
        wx.navigateTo({
          url: ''
        })
      },

      tap_logout:function(e){
        app.globalData.U_ID="";
        app.globalData.identity="";
        wx.navigateTo({
          url: '/pages/login/login'
        })
      },

      click_record:function (e) {
        var that = this
        let index = e.currentTarget.dataset.index
        console.log(index)
        console.log(this.data.remind[index].Name)
        wx.navigateTo({
          url: '/pages/add_record/record?patient_id='+this.data.remind[index].info2+'&Name='+this.data.remind[index].Name+'&Gender='+this.data.remind[index].Gender+'&Age='+this.data.remind[index].Age
        })
      },
})
