//index.js
//获取应用实例
const app = getApp()

Page({
  onShow: function () {
    this.registeApp()
  },
  registeApp:function(){
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res.code)
        wx.request({
          //获取openid接口
          url: app.globalData.baseUrl+'get/weapp/openid',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            code: res.code,
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            var resultCode = res.data.resultCode
            if(resultCode == 1000){
              var openId = res.data.body.openId
              app.globalData.openId = openId
              that.getUserId(openId)
            }
          }
        })
      },
      fail:function(res){
        that.showMessageModal()
      }
    })

  },
  getUserId:function(openId){
    var that = this;
    console.log("openId-----"+openId)
    wx.request({
      url: app.globalData.baseUrl + "user/login/register",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { openid: openId},
      success:function(res){
        var resultCode = res.data.resultCode
        if(resultCode==1000){
          var code = res.data.body.code;
            if(code == 1){
              var userInfo = res.data.body.userInfo;
              that.saveUserInfo(userInfo)
            }
            wx.switchTab({
              url: '../home/home',
            })
        }else{
          that.showMessageModal()
        }
        console.log(res)
      },
      fail:function(res){
        that.showMessageModal()
      }
    })
  },
  showMessageModal:function(){
    var that = this
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: "重新注册",
      content: '注册失败,点击重新注册',
      success: function (res) {
        if (res.confirm) {
          that.registeApp()
        }
      }
    })
  },
  saveUserInfo: function (userInfo){
      if(userInfo==null || userInfo=="null"){
        app.globalData.userInfo = null;
        app.globalData.userId = null;
      }else {
        app.globalData.userInfo = userInfo
        if (userInfo.id == null || userInfo.id == "null"){
          app.globalData.userId = null
        }else{
          app.globalData.userId = userInfo.id
        }
      }
      
    
  }
  
})
