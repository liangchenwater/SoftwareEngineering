// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'),// 如需尝试获取用户信息可改为false
    myID: '0000000003',
    patientInfo: [],
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.initialize_list();
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow() {
   this.initialize_list();
    },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  click_set_top:function(e){
    var arr=this.data.patientInfo;
    var idx=e.currentTarget.dataset.index;
    var tmp=arr[idx];
    arr[idx]=arr[0];
    arr[0]=tmp;
    this.setData({
     patientInfo: this.data.patientInfo
    })
  },
  click_delete:function(e){
    //modify the list in the front
   var arr=this.data.patientInfo;
    var idx=e.currentTarget.dataset.index;
    /*arr.splice(idx,1);
    this.setData({
      patientInfo: this.data.patientInfo
     })*/
     //modify the list in the back
     var that=this;
     console.log(that.data.patientInfo[idx].patientID)
    wx.request({
      url: app.globalData.IP_address+'/deletecontact',
      header: { "ContentType": "application/json;charset=utf-8" },
      data: {
        uid: app.globalData.U_ID,
        contact_id: that.data.patientInfo[idx].patientID
      },
      method: 'post',
      success: function(res){
        console.log(res);
      }
    })
    this.initialize_list()
  },
  /*
  click_add:function(e){
    
      wx.request({
        url: 'http://127.0.0.1:5000/getcontacts',
       header: { "ContentType": "application/json;charset=utf-8" },
      data: {
        uid: this.data.myID
      },
      method: 'post',
      success: function(res){
        var orig_len=this.data.patientInfo.length();
        for(i=0;i<res.length();i++){
          if(i<orig_len){
          var c="patientInfo["+i+"].patientID"
          this.setData({
            [c]: res[i]
          })
        }
        else{
          var tmp_arr=this.data.patientInfo;
          arr.push({patientID:res[i]});
        }
        }
      }
      })
      for(i=0;i<this.data.patientInfo.length();i++){
        wx.request({
          url: 'http://127.0.0.1:5000/getcontacts',
          header: { "ContentType": "application/json;charset=utf-8" },
          data:{
            identity: 'P',
            U_ID: this.patientInfo[i].patientID
          },
          success: function(res){
            var c="patientInfo["+i+"].name"
            this.setData({
              [c]:res.name
            })
           var c="patientInfo["+i+"].title"
            this.setData({
              [c]:res.Title
            })
           var c="patientInfo["+i+"].department"
            this.setData({
              [c]:res.Department
            })
            var c="patientInfo["+i+"].hospital"
            this.setData({
              [c]:res.Hospital
            })
            var c="patientInfo["+i+"].attend_time"
            this.setData({
              [c]:res.Work_Time
            })
           
          }
        })
      }
  },
*/


  click_record:function(e){
    var idx=e.currentTarget.dataset.index;
    var key1=this.data.patientInfo[idx].patientID
    wx.navigateTo({
      url: '../record_list_doctor/record_list?key1='+key1
    })
  },
  for_data:function(e){
    var that=this;
    wx.request({
      url: app.globalData.IP_address+'/userinfo',
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data:{
        identity: 'P',
        U_ID: that.data.patientInfo[e].patientID
      },
      method: 'post',
      success: function(res){
        console.log(res)
        var c="patientInfo["+e+"].name"
        that.setData({
          [c]:res.data.U_Name
        })
       var d="patientInfo["+e+"].gender"
       if(res.data.Gender=='M')
       that.setData({
          [d]:'男'
        })
        else if(res.data.Gender=='F')
        that.setData({
           [d]:'女'
         })
        else
         that.setData({
            [d]:'其他'
          })
       var q="patientInfo["+e+"].age"
       that.setData({
          [q]:res.data.Age
        })
        var f="patientInfo["+e+"].phone"
        that.setData({
          [f]:res.data.Phone
        })
       var h="patientInfo["+e+"].avatarURL"
       that.setData({
         [h]:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg3.doubanio.com%2Fview%2Fgroup_topic%2Fl%2Fpublic%2Fp424351841.jpg&refer=http%3A%2F%2Fimg3.doubanio.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1627975046&t=cba7f4bc3a26e598e507a8c6de211998"
       })
      }
    })
  },
  initialize_list:function(e){
    var that=this;
    that.setData({
      patientInfo: [],
    })
    wx.request({
      url: app.globalData.IP_address+'/getcontacts',
      //header: { "ContentType": "application/json;charset=utf-8" },
      data: {
        uid: app.globalData.U_ID,
      },
      method: 'get',
      success: function(res){
        console.log(res.data);
        for(var i=0;i<res.data.length;i++){
          that.data.patientInfo.push({patientID: res.data[i]});
          that.for_data(i);
        }
        console.log(that.data.patientInfo);
      }
    })
  },
})

  


