// pages/register/register.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      identity:"P",
      name:"",
      number:"",
      password:"",
      verify_password:"",
      gender:"M",
      age:"",
      office:"",
      position:"",
      cert_ID:"",
      items: [
        { name: 'doctor', value: '我是医生' ,checked: 'false'},
        { name: 'patient', value: '我是患者', checked: 'true' }
      ],
      showView:false,
      height:'1000rpx',
      array: ['男', '女', '其他'],
      index: 0,
      objectArray: [
        {
          id: 0,
          name: '男'
        },
        {
          id: 1,
          name: '女'
        },
        {
          id: 2,
          name: '其他'
        },
      ],
      typeName1: 'password',
      typeName2: 'password',
      passFlag1: 1,
      passFlag2: 1,
      storePass1: '',  // 暂存密码,用于显示密码
      storePass2: ''  // 暂存密码,用于显示密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (ide,hid) {
    showView:(options.showView=="true"?true:false)
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
    console.log(this.data.hidden);
    console.log(this.data.identity);
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
      password:e.detail.value,
      storePass1: e.detail.value
    })
  },
  set_name:function(e){
    this.setData({
      name:e.detail.value
    })
  },
  set_verify_password:function(e){
    this.setData({
      verify_password:e.detail.value,
      storePass2: e.detail.value
    })
  },

  set_age:function(e){
    this.setData({
      age:e.detail.value
    })
  },

  set_gender:function(e){
    console.log(e.detail.value);
    this.setData({
      index: e.detail.value
    })
    if(e.detail.value='男'){
      this.setData({
        gender:'M'
      })
    }
    else if(e.detail.value='女'){
      this.setData({
        gender:'F'
      })
    }

    else if(e.detail.value='其他'){
      this.setData({
        gender:'O'
      })
    }
  },

  set_position:function(e){
    this.setData({
      position:e.detail.value
    })
  },

  set_office:function(e){
    this.setData({
      office:e.detail.value
    })
  },

  set_cert_ID:function(e){
    this.setData({
      cert_ID:e.detail.value
    })
  },

  click_register:function(e){
    if(this.data.password!=this.data.verify_password){
      wx.showToast({
        title: '密码不一致！',
        icon: 'none',
        duration: 200
      })
    }
    else{
      console.log(this.data.password);
      console.log(this.data.verify_password);
      var send_data;
      if(this.data.identity=='P'){
        send_data={
          phone: this.data.number,
          password: this.data.password,
          name: this.data.name,
          identity:this.data.identity,
          gender:this.data.gender,
          age:this.data.age
        }
      }
      else {
        send_data={
          phone: this.data.number,
          password: this.data.password,
          name: this.data.name,
          identity:this.data.identity,
          gender:this.data.gender,
          age:this.data.age,
          department:this.data.office,
          title:this.data.position,
          certificate:this.data.cert_ID,
          worktime:""
        }
      }
      console.log(send_data);
    wx.request({
      url:app.globalData.IP_address+'/signup', 
      header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
      data: send_data,
      method: 'post',
      success: function (res) {
            console.log("发送成功");
            if(res.data.state=='0'){
              wx.showToast({
                title: '注册成功！',
                icon: 'none',
                duration: 1500
              })
              wx.navigateTo({
                url: '/pages/login/login'
              })
            } 
            else{
              wx.showToast({
                title: '该用户已存在！',
                icon: 'none',
                duration: 1500
              })
            }
      },
      fail: function(res){
            console.log("-------fail------")
          }
        })
      }
      },

      radioChange:function(e){
        var that=this;
        that.setData({
          showView:(!that.data.showView)

        })
        if(this.data.identity=='P')  {
          that.setData({
            identity: `D`
          });
          that.setData({
            height: `1300rpx`
          });
        }
        else {
          that.setData({
            identity: `P`
          });
          that.setData({
            height: `1000rpx`
          });
      }
      },
      showPass1(){     // 显示密码而非*号
        console.log(this.data.storePass1)
        if (this.data.passFlag1 == 1){ // 第一次点击
          this.setData({ passFlag1: 2, typeName1 : 'text'});
        }else{                        // 第二次点击
          this.setData({ passFlag1: 1, typeName1 : 'password'});
        }
      },
      showPass2(){     // 显示密码而非*号
        console.log(this.data.storePass2)
        console.log(this.data.passFlag)
        if (this.data.passFlag2 == 1){ // 第一次点击
          this.setData({ passFlag2: 2, typeName2 : 'text'});
        }else{                        // 第二次点击
          this.setData({ passFlag2: 1, typeName2 : 'password'});
        }
      }
      
    })