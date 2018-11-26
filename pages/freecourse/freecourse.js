// pages/freecourse/freecourse.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freeCourseData:[],
    pageNum:1
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
      this.findFreeCourseData()
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
    this.setData({ pageNum: 1, freeCourseData:[]})
    this.findFreeCourseData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.findFreeCourseData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  use:function(res){
    var userId = app.globalData.userId
    if(userId != null){
      var index = res.currentTarget.dataset.index
      var id = this.data.freeCourseData[index].classId
      wx.navigateTo({
        url: '../freeclassdetail/freeclassdetail?id=' + id,
      })
    }else{
      wx.showToast({
        title: '请登录',
      })
      wx.switchTab({
        url: '../mine/mine',
      })
    }
   

  },
  findFreeCourseData:function(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/free/courseInfo/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { pageNum: that.data.pageNum, pageSize: 10 },
      method: "POST",
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          if(body.length == 0){
            wx.showToast({
              title: '没有数据了',
            })
          }else{
            that.setData({ freeCourseData: that.data.freeCourseData.concat(body) })
            that.setData({ pageNum: that.data.pageNum + 1 })
          }
        } else {
          that.showFreeMessageModal()
        }
      },
      fail: function (res) {
        that.showFreeMessageModal()
      },
      complete:function(){
        wx.stopPullDownRefresh()
      }
    })
  },
  showFreeMessageModal: function () {
    var that = this
    wx.showModal({
      title: '提示',
      cancelText: "取消",
      confirmText: "重新获取",
      content: '获取数据失败',
      success: function (res) {
        if (res.confirm) {
          that.findFreeCourseData()
        }
      }
    })
  }
})