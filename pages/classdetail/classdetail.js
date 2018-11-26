// pages/classdetail/classdetail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentChoose: 0,
    headImg:null,
    courseData:null,
    userId:null,
    id:null,
    classId:null,
    courseId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = app.globalData.userId
    this.setData({ userId: userId })
    var pageType = options.pageType
   if(pageType == 1){
     this.setData({ id:null })
     this.setData({ classId: options.id })
   }else{
     this.setData({ id: options.id })
     this.setData({ classId: null })
   }
    this.setData({ courseId:options.id})
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var id = this.data.id
    var classId = this.data.classId
    this.findCourseInfo(id,classId)
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
  onTabsItemTap: function (data) {
    this.setData({ currentChoose: data.currentTarget.dataset.index })
  },
  findCourseInfo: function (id, classId) {
    var that = this
    var userId =this.data.userId
    console.log(userId+"--"+id+"----"+classId)

    wx.request({
      url: app.globalData.baseUrl + "find/courseInfo/single",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { id: id, userId: userId, classId: classId},
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({ courseData: body })
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
      cancelText: "取消",
      confirmText: "重新获取",
      content: '获取数据失败',
      success: function (res) {
        if (res.confirm) {
          var id = that.data.id
          var classId = that.data.classId
          that.findCourseInfo(id, classId)
        }
      }
    })
  },
  signup: function () {
    var userId = this.data.userId
    var courseId = this.data.courseId
    if (userId != null) {
      wx.navigateTo({
        url: '../courseenrollment/courseenrollment?fromType=1&courseId=' + courseId,
      })
    }
  },
  gosignup:function(res){
    console.log(res)
    var index = res.currentTarget.dataset.index
    var userId = this.data.userId
    var item = this.data.courseData.courseClassList[index]
    var courseId = item.courseId
    var classId = item.id
    var schoolId = item.schoolId
    if (userId != null) {
      wx.navigateTo({
        url: '../courseenrollment/courseenrollment?fromType=2&courseId=' + courseId + "&classId=" + classId + "&schoolId=" + schoolId,
      })
    }
  },
  onItemClick: function (res) {
    var id = res.currentTarget.dataset.id
    wx.navigateTo({
      url: '../secondvideo/secondvideo?id=' + id,
    })
  },
})