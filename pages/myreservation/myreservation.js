// pages/myreservation/myreservation.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reserveData:[],
    pageNum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.findCourseReserveList()
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
    this.setData({ pageNum: 1, reserveData: [] })
    this.findCourseReserveList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.findCourseReserveList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  detail: function (res) {
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '../freeclassdetail/freeclassdetail?id=' + id,
    })
  }, 
  findCourseReserveList:function(){
    var userId = app.globalData.userId
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/courseReserve/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { userId: userId, pageNum: that.data.pageNum, pageSize: 10},
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          if (body.length == 0) {
            wx.showToast({
              title: '没有数据了',
            })
          } else {
            that.setData({ reserveData: that.data.reserveData.concat(body) })
            that.setData({ pageNum: that.data.pageNum + 1 })
          }
        } else {
         
        }
      },
      fail: function (res) {
        
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  }
})