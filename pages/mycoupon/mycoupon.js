// pages/mycoupon/mycoupon.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentChoose: 1,
    useUrl:"../images/quan_bg_choose.png",
    notUseUrl:"../images/quan_bg_gray.png",
    couponData:[],
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
    var currentChoose = this.data.currentChoose
    this.findCouponUserList(currentChoose)
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
    this.setData({ currentChoose:1})
    var currentChoose = this.data.currentChoose
    this.setData({ pageNum: 1, couponData: [] })
    this.findCouponUserList(currentChoose)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var currentChoose = this.data.currentChoose
    this.findCouponUserList(currentChoose)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onTabsItemTap: function (data) {
    var index = data.currentTarget.dataset.index
    console.log(index)
    this.setData({ currentChoose: index})
    this.setData({ pageNum: 1, couponData: [] })
    this.findCouponUserList(index)
  },
  findCouponUserList: function (couponStatus){
    var userId = app.globalData.userId
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/couponUser/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { userId: userId, couponStatus: couponStatus, pageNum: that.data.pageNum, pageSize: 10},
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
            that.setData({ couponData: that.data.couponData.concat(body) })
            that.setData({ pageNum: that.data.pageNum + 1 })
          }
        } else {

        }
      },
      fail: function (res) {

      },
      complete:function(){
        wx.stopPullDownRefresh()
      }
    })
  },
  use:function(res){
    var index = res.currentTarget.dataset.index
    var item = this.data.couponData[index]
    if(item.status !=1){
      return;
    }
    if(item.useType == 1 || item.useType == 2){
      wx.navigateTo({
        url: '../courseintroduction/courseintroduction',
      })
    } else if (item.useType == 3){
      var id = item.useItemId
      wx.navigateTo({
        url: '../classdetail/classdetail?id=' + id,
      })
    } else if (item.useType == 4){
      wx.switchTab({
        url: '../video/video',
      })
    } else if (item.useType == 5){
      var id = item.useItemId
      wx.navigateTo({
        url: '../videoclassdetail/videoclassdetail?id=' + id,
      })
    }
  }
  
})