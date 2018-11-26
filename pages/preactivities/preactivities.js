// pages/preactivities/preactivities.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponData: [],
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
    this.findCouponDataList()
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
    this.setData({pageNum:1})
    this.setData({ couponData:[]})
    this.findCouponDataList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.findCouponDataList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onItemClick:function(){
    wx.navigateTo({
      url: '../preactivitiesdetail/preactivitiesdetail',
    })
  },
  findCouponDataList: function () {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/preferentialActivity/list",
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
            that.setData({ couponData: that.data.couponData.concat(body) })
            that.setData({ pageNum: that.data.pageNum + 1 })
          }
        } else {
          that.showMessageModal()
        }
      },
      fail: function (res) {
        that.showMessageModal()
      },
      complete:function(){
        wx.stopPullDownRefresh()
      }
    })
  },
  showMessageModal: function () {
    var that = this
    wx.showModal({
      title: '提示',
      cancelText: "取消",
      confirmText: "重新获取",
      content: '获取数据失败',
      success: function (res) {
        if (res.confirm) {
          that.findCourseCategoryList()
        }
      }
    })
  },
})