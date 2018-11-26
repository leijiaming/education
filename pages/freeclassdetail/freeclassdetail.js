// pages/freeclassdetail/freeclassdetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      id:null,
    freeCourseData:null,
    actionSheetHidden: true,
     name: null,
    gradeNum: null,
    phone: null,
    reserveStatus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
      this.setData({id:options.id})

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      this.findFreeClassDetail();
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
  findFreeClassDetail:function(){
    var that = this
    var id = this.data.id;
    var userId = app.globalData.userId
    console.log(id)
    wx.request({
      url: app.globalData.baseUrl + "find/free/courseClass/single",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data:{id:id,userId:userId},
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({ freeCourseData: body, reserveStatus: body.reserveStatus })
        } 
      },
      fail: function (res) {
        
      },
      complete: function () {
        
      
      }
    })
  },
  use: function (res) {
    var reserveStatus = this.data.reserveStatus
    if (reserveStatus == 0){
      var freeCourseData = this.data.freeCourseData
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden,
      })
    }
   
  },
  iName: function (res) {
    var name = res.detail.value
    this.setData({ name: name });
  },
  iGradeNum: function (res) {
    var gradeNum = res.detail.value
    this.setData({ gradeNum: gradeNum });
  },
  iPhone: function (res) {
    var phone = res.detail.value
    this.setData({ phone: phone });
  },
  submit: function () {
    var userId = app.globalData.userId
    if (userId != null) {
      this.goSubmit(userId)
    }
  },
  goSubmit: function (userId) {
    var name = this.data.name
    var gradeNum = this.data.gradeNum
    var phone = this.data.phone
    if (name == null || name.trim() == "") {
      wx.showToast({
        title: '请输入您的姓名',
      })
      return;
    }
    if (gradeNum == null || gradeNum.trim() == "") {
      wx.showToast({
        title: '请输入您的公立学校年级',
      })
      return;
    }
    if (phone == null || phone.trim() == "") {
      wx.showToast({
        title: '请输入您的手机号',
      })
      return;
    }
    if (phone.length > 11 || !(/^1[34578]\d{9}$/.test(phone))){
      wx.showToast({
        title: '手机号格式不正确',
      })
      return;
    }

    var classId = this.data.id
    console.log(classId + "--" + userId + "---" + gradeNum)
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "save/update/courseReserve",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { gradeNum: gradeNum, classId: classId, mobile: phone, stuName: name, userId: userId },
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var code = res.data.body.code
          if (code == 1) {
            wx.showToast({
              title: '预约成功',
            })
            that.setData({
              actionSheetHidden: !that.data.actionSheetHidden,
              name: null, age: null, phone: null, currentId: null, title: null, reserveStatus:1
            })
          }
        } else {
          that.showAppoMessageModal()
        }
      },
      fail: function (res) {
        that.showAppoMessageModal()
      }
    })
  },
  showAppoMessageModal: function () {
    var that = this
    wx.showModal({
      title: '提示',
      cancelText: "取消",
      confirmText: "重新预约",
      content: '预约失败',
      success: function (res) {
        if (res.confirm) {
          var userId = app.globalData.userId
          that.goSubmit(userId)
        }
      }
    })
  }
})