// pages/main/main.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      Name:'王小明',
      Department:'',
      Title:'',

      
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

    // 通过 SelectorQuery 获取 Canvas 节点
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.init.bind(this))

      wx.request({
        url: app.globalData.IP_address+'/userinfo', 
        header: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        data: {
            U_ID: app.globalData.U_ID,
            identity: app.globalData.identity,
         },
         method: 'POST',
         success: function (res) {
              console.log("发送成功");
              console.log(res);
              this.setData({ 
                Name: res.data.U_Name, 
                Department:res.data.Department,
                Title:res.data.Title
              });
         },
         fail:function(res){
          console.log("发送失败");
        }
      })
  },

  init(res) {
    const canvas = res[0].node
    const width = wx.getSystemInfoSync().windowWidth
    const height = wx.getSystemInfoSync().windowHeight
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    this.render(canvas, ctx)
  },
  render(canvas, ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.width)
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
    let data = e.detail.data
    console.log(data)
   },
   pull_menu:function(){
     console.log("pull")
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
      }
})
