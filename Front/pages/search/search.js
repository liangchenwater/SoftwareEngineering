const app = getApp()
Page({
  data: {
      inputShowed: false,
      inputVal: '',
      key_phone: '',
      key_name: '',
      key_hospital: '',
      key_department: '',
      res_list: [],
  },
  onLoad() {
      this.setData({
          search: this.search.bind(this)
      })
  },
  search: function (value) {
      return new Promise((resolve, reject) => {
        console.log(resolve);
          setTimeout(() => {
            var that=this
            switch(that.data.searchKey){
                case "1": 
                that.data.key_hospital=value; 
                that.data.key_department=that.data.key_phone=that.data.key_name='';
                break;
                case "2": that.data.key_name=value; 
                that.data.key_department='';
                that.data.key_hospital=that.data.key_phone='';
                break;
                case "3": that.data.key_phone=value; 
                that.data.key_hospital=that.data.key_name=that.data.key_department='';
                break;
                case "4": that.data.key_department=value; 
                that.data.key_hospital=that.data.key_name=that.data.key_phone='';
                break;
            }
            console.log(that.data)
              wx.request({
                url: app.globalData.IP_address+'/searchdocs',
                header: { "ContentType": "application/json;charset=utf-8" },
                data:{
                  phone: that.data.key_phone,
                  name:  that.data.key_name,
                  hospital: that.data.key_hospital,
                  department: that.data.key_department
                },
                method: 'post',
                success:function(res){
                  that.data.res_list=[];
                  console.log(res);
                  console.log(res.data.length);
                  for(var i=0;i<res.data.length;i++){
                    that.data.res_list.push({text:res.data[i].U_Name,value:res.data[i].U_ID});
                  }
                }
              })
              console.log(that.data.res_list)
              resolve(that.data.res_list)
          },200)
      })
  },

  selectResult: function (e) {
      var contactID=e.detail.item.value;
      wx.request(
        {
          url: app.globalData.IP_address+'/addcontact',
          header: { "ContentType": "application/json;charset=utf-8" },
          data:{
            uid: app.globalData.U_ID,
            contact_id: contactID,
          },
          method: 'post',
          success:function(res){
            console.log(res);
          }
        }
      )
      console.log('select result', e.detail)
      wx.navigateBack()
  },
  data:{
    array:[
        {name: '医院', value: '1', checked: 'true'},
        {name: '姓名', value: '2'},
        {name: '手机号', value: '3'},
        {name: '科室', value: '4'},
    ]
  },
  /**
   * radio监听事件
   */
  listenerRadioGroup:function(e) {
      this.setData({
        searchKey: e.detail.value
      })
      console.log(e);
      console.log(this.search);
  },
});