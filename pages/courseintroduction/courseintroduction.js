// pages/courseintroduction/courseintroduction.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentChoose: 0,
    categoryDetailData:[],
    categoryData:null,
    userId:null,
    pageNum:1,
    categoryId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = app.globalData.userId
    this.setData({ userId: userId })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.findCourseCategoryList()
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
    this.setData({ currentChoose:0})
    this.setData({ pageNum: 1, categoryDetailData:[]})
    this.findCourseCategoryList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var categoryId = this.data.categoryId
    this.findCategoryDetailData(categoryId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  onTabsItemTap: function (data) {
    var index = data.currentTarget.dataset.index
    this.setData({ currentChoose: index })
    var categoryId = this.data.categoryData[index].id
    this.setData({ pageNum: 1, categoryDetailData: [], categoryId: categoryId})
    this.findCategoryDetailData(categoryId)
  },
  detail:function(res){
    var userId = this.data.userId
    if (userId == null) {
      wx.showToast({
        title: '请先登录',
      })
      wx.switchTab({
        url: '../mine/mine',
      })
      return
    }
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '../classdetail/classdetail?id=' + id,
    })
  },
  findCourseCategoryList:function(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/courseCategory/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      //data: { lat: latitude, log: longitude },
      method: "POST",
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({categoryData: body })
          if(body.length >0){
            that.setData({ categoryId: body[0].id})
            that.findCategoryDetailData(body[0].id)
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
  findCategoryDetailData: function (categoryId){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/courseInfo/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: { categoryId: categoryId, pageNum: that.data.pageNum, pageSize: 10},
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
            that.setData({ categoryDetailData: that.data.categoryDetailData.concat(body) })
            that.setData({ pageNum: that.data.pageNum + 1 })
          }
        } else {
          that.showDetailMessageModal()
        }
      },
      fail: function (res) {
        that.showDetailMessageModal()
      }
    })
  },
  showDetailMessageModal: function () {
    var currentChoose = this.data.currentChoose
    var categoryId = this.data.categoryData[currentChoose].id
    var that = this
    wx.showModal({
      title: '提示',
      cancelText: "取消",
      confirmText: "重新获取",
      content: '获取数据失败',
      success: function (res) {
        if (res.confirm) {
          that.findCategoryDetailData(categoryId)
        }
      }
    })
  }
})