// pages/reviseinfo/reviseinfo.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reviseinfo: null,
    chooseItem:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1]; //当前页
    var prevPage = pages[pages.length - 2]; //上一个页面
    var chooseItem = prevPage.data.chooseItem
    var userInfo = prevPage.data.userInfo //取上页data里的数据也可以修改
    var reviseinfo
    switch (chooseItem) {
      case "1":
        reviseinfo = userInfo.realName
        break
      case "2":
        reviseinfo = userInfo.mobile
        break
      case "3":
        reviseinfo = userInfo.address
        break
      case "4":
        reviseinfo = userInfo.studentName
        break
      case "5":
        reviseinfo = userInfo.publicSchool
        break
      case "6":
        reviseinfo = userInfo.publicGrade
        break
      case "7":
        reviseinfo = userInfo.cleClass
        break
      case "8":
        reviseinfo = userInfo.cleStartDate
        break
    }
    console.log("chooseItem------" + chooseItem)
    this.setData({
      reviseinfo: reviseinfo,
      chooseItem: chooseItem
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  inputInfo:function(res){
    var reviseinfo = res.detail.value
    this.setData({ reviseinfo: reviseinfo})
  },
  save:function(){
    var reviseinfo = this.data.reviseinfo
    if (reviseinfo == null || reviseinfo == "" || reviseinfo.trim() == ""){
          wx.showToast({
            title: '请输入要修改的信息',
          })
          return
    }
    var userId = app.globalData.userId
    var info = {}
    var chooseItem = this.data.chooseItem
    switch (chooseItem) {
      case "1":
        info = { realName: reviseinfo, userId: userId}
        break
      case "2":
        info = { mobile: reviseinfo, userId: userId }
        break
      case "3":
        info = { address: reviseinfo, userId: userId}
        break
      case "4":
        info = { studentName: reviseinfo, userId: userId }
        break
      case "5":
        info = { publicSchool: reviseinfo, userId: userId }
        break
      case "6":
        info = { publicGrade: reviseinfo, userId: userId }
        break
      case "7":
        info = { cleClass: reviseinfo, userId: userId }
        break
      case "8":
        info = { cleStartDate: reviseinfo, userId: userId }
        break
    }
    console.log("info-----" + info.realName + "---" + info.userId);
    this.uploadUserInfo(info)
  },
  uploadUserInfo: function (info) {
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + "save/update/user",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: info,
      success: function (res) {
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var code = res.data.body.code
          if (code == 1) {
              wx.showToast({
                title: '修改成功',
              })
              var pages = getCurrentPages();
              var Page = pages[pages.length - 1]; //当前页
              var prevPage = pages[pages.length - 3]; //上一个页面
              var userInfo = prevPage.data.userInfo
              var chooseItem = that.data.chooseItem
              var reviseinfo = that.data.reviseinfo
              switch (chooseItem) {
                case "1":
                  userInfo.realName = reviseinfo
                  break
                case "2":
                  userInfo.mobile = reviseinfo
                  break
                case "3":
                  userInfo.address = reviseinfo
                  break
                case "4":
                  userInfo.studentName = reviseinfo
                  break
                case "5":
                  userInfo.publicSchool = reviseinfo
                  break
                case "6":
                  userInfo.publicGrade = reviseinfo
                  break
                case "7":
                  userInfo.cleClass = reviseinfo
                  break
                case "8":
                  userInfo.cleStartDate = reviseinfo
                  break
              }
              prevPage.data.userInfo = userInfo
              wx.navigateBack()
            
          } else {
            that.showMessageModal()
          }
        } else {
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
      confirmText: "重新修改",
      content: '修改用户数据失败',
      success: function (res) {
        if (res.confirm) {
          that.save()
        }
      }
    })
  }
})