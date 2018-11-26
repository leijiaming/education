// pages/myclass/myclass.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCourseData:[],
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

    this.findUserCourseList()
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
    this.setData({ pageNum: 1, userCourseData: [] })
    this.findUserCourseList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.findUserCourseList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  detail:function(res){
    var index = res.currentTarget.dataset.index
    var itemId = this.data.userCourseData[index].itemId
    var orderType = this.data.userCourseData[index].orderType
    if(orderType == '1'){
      wx.navigateTo({
        url: '../classdetail/classdetail?pageType=1&id=' + itemId,
      })
    } else if (orderType == '2'){
      wx.navigateTo({
        url: '../videoclassdetail/videoclassdetail?id=' + itemId,
      })
    }
  
  },
  findUserCourseList:function(){
    var userId = app.globalData.userId
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/user/course/list",
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
            that.setData({ userCourseData: that.data.userCourseData.concat(body) })
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