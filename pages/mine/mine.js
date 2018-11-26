// pages/mine/mine.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    persionIcon: "../images/my_personal.png",
    couponIcon:"../images/my_coupons.png",
    appoIcon:"../images/my_appo.png",
    classIcon:"../images/my_classroom.png",
    defaultIcon:"../images/my_people.png",
    nextIcon:"../images/arrow-r.png",
    avatarUrl:null,
    nickName:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ userInfo: app.globalData.userInfo})
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
  onItemClick: function (data) {
    var userId = app.globalData.userId
    if(userId ==null){
      wx.showToast({
        title: '请登录',
      })
      return
    }
    switch (data.currentTarget.dataset.index) {
      case '0':
        wx.navigateTo({
          url: '../myinfo/myinfo',
        })
        break
      case '1':
        wx.navigateTo({
          url: '../myclass/myclass',
        })
        break
      case '2':
        wx.navigateTo({
          url: '../myreservation/myreservation',
        })
        break
      case '3':
        wx.navigateTo({
          url: '../mycoupon/mycoupon',
        })
        break
      case '4':
        wx.navigateTo({
          url: '../weekcourse/weekcourse?userId=' + userId +'&choose=1',
        })
        break
      case '5':
        wx.navigateTo({
          url: '../auth/auth',
        })
        break
    }
  },
  onGotUserInfo: function (e) {
    var errMsg = e.detail.errMsg;
    if (errMsg == "getUserInfo:ok"){
      console.log(e)
      var avatarUrl = e.detail.userInfo.avatarUrl;
      var nickName = e.detail.userInfo.nickName;
      this.setData({ avatarUrl:avatarUrl, nickName:nickName});
      var openId = app.globalData.openId
      if(openId ==null){
        this.registeApp();
      }else{
        this.uploadUserInfo(avatarUrl, nickName)
      }
    }else{
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: "知道了",
        content: '用户授权失败',
        success: function (res) {
        }
      })
    }
  },
  registeApp: function () {
    var that = this;
    wx.login({
      success: function (res) {
        console.log(res.code)
        wx.request({
          //获取openid接口
          url: app.globalData.baseUrl + 'get/weapp/openid',
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
            if (resultCode == 1000) {
              var openId = res.data.body.openId
              app.globalData.openId = openId
              that.getAppUserId(openId)
            }
          }
        })
      },
      fail: function (res) {
        that.showMessageModal()
      }
    })

  },
  uploadUserInfo: function (avatarUrl, nickName){
    var openId = app.globalData.openId
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "save/update/user",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { xcxOpenid: openId, headImg: avatarUrl, nickName:nickName},
      success: function (res) {
        var resultCode = res.data.resultCode
        if(resultCode == 1000){
          var code = res.data.body.code
          if(code == 1){
            that.getUserId(openId)
          }else{
            that.showMessageModal()
          }
        }else{
          that.showMessageModal()
        }
      },
      fail: function (res) {
        that.showMessageModal()
      }
    })
  },
  showMessageModal: function () {
    var that = this
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: "知道了",
      content: '同步用户数据失败',
      success: function (res) {
      }
    })
  },
  getUserId: function (openId) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "user/login/register",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { openid: openId },
      success: function (res) {
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var code = res.data.body.code;
          if (code == 1) {
            var userInfo = res.data.body.userInfo;
            that.saveUserInfo(userInfo)
          }
        } else {
          that.showRegisterMessageModal()
        }
      },
      fail: function (res) {
        that.showRegisterMessageModal()
      }
    })
  },
  getAppUserId: function (openId) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "user/login/register",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { openid: openId },
      success: function (res) {
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var avatarUrl = that.data.avatarUrl;
          var nickName = that.data.nickName;
          that.uploadUserInfo(avatarUrl, nickName)
        } else {
          that.showRegisterMessageModal()
        }
      },
      fail: function (res) {
        that.showRegisterMessageModal()
      }
    })
  },
  showRegisterMessageModal: function () {
    var that = this
    wx.showModal({
      title: '提示',
      showCancel: false,
      confirmText: "重新注册",
      content: '注册失败,点击重新注册',
      success: function (res) {
        if (res.confirm) {
          var openId = app.globalData.openId
          that.getUserId(openId)
        }
      }
    })
  },
  saveUserInfo: function (userInfo) {
    this.setData({ userInfo: userInfo})
    app.globalData.userId = userInfo.id
    app.globalData.userInfo = userInfo
  }
})