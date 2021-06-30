// pages/record_list/record_list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:[
      {
        time:"2021-10-21 10:00",
        doctor_name:"王刚"
      },
      {
        time:"2021-10-23 09:00",
        doctor_name:"王刚"
      }
      ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      //等待填充
      url: app.globalData.IP_address+'/    ', 
      header: { "ContentType": "application/json;charset=utf-8", },
      data: {
          patient_id:app.globalData.U_ID,
       },
       method: 'POST',
       success: function (res) {
            console.log("发送成功");
            console.log(res.data);
            that.setData({ 
                record:res.data
            });
       },
       fail:function(res){
        console.log("发送失败");
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
  to_one_record:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    let currect = "remind["+index+"].ID"

    if (that.data.remind[index].Complete === true) {
      that.setData({
        [currect]: false
      })
    } else{
      that.setData({
        [currect]: true
      })
    }
    wx.navigateTo({
      url: '/pages/record/record?data='+remind["+index+"]
    })
  }
})