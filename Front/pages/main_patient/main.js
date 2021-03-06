// pages/main/main.js
const app = getApp()
var util=require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
      Name:'',
      Age:'',
      Gender:'',
      remind:[
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
       fail:function(){
        console.log("发送失败");
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
            that.get_info()
       },
       fail:function(res){
        console.log("发送失败");
      }
    })
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
    that.setData({
      date: e.detail.data
    });
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
            that.get_info()
       },
       fail:function(res){
        console.log("发送失败");
      }
    })
    console.log("remind"+this.data.remind);
   },

   get_info:function(){
    var that=this;
    for(var i in that.data.remind){
        that.get_data(i)
      }
   },
   get_data:function(e){
     var i=e;
     var that=this
    　if(that.data.remind[i].Event_Type!='M'){
      wx.request({
        url: app.globalData.IP_address+'/userinfo', 
        header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        data: {
            U_ID: that.data.remind[i].info1,
            identity: 'D',
        },
        method: 'POST',
        success: function (res) {
              console.log("sub_userinfo发送成功");
              that.setData({ 
                ['remind['+i+'].D_Name']:res.data.U_Name, 
                ['remind['+i+'].Department']:res.data.Department, 
                ['remind['+i+'].Hospital']:res.data.Hospital, 
                ['remind['+i+'].Phone']: res.data.Phone
              });
              console.log(i+res.data)
        },
        fail:function(res){
          console.log("sub_user发送失败");
        }
      })
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
    let currect = "remind["+index+"].Complete"
    console.log(this.data.remind[0])
    if (this.data.remind[index].Complete == 'Y') {
      that.setData({
        [currect]: 'N'
      })
    } else{
      that.setData({
        [currect]: 'Y'
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
          url: '/pages/changeinfo_patient/userinfo'
        })
      },
      tap_friend: function(e){
        wx.navigateTo({
          url: '/pages/AddressbookP/AddressbookP'
        })
      },
      
      tap_record: function(e){
        wx.navigateTo({
          url: '/pages/record_list_patient/record_list'
        })
      },

      tap_logout:function(e){
        app.globalData.U_ID="";
        app.globalData.identity="";
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }
})
