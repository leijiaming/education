// pages/weekcourse/weekcourse.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userId:null,
    courseInfoList:[],
    schoolList:null,
    schoolId:null,
    schoolName:"",
    choose:0,
    pageNum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var userId = options.userId
    var choose = options.choose
    if(choose == 1){
      this.setData({ userId: userId})
    }
    this.setData({choose: choose })
    
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var userId = this.data.userId
    var schoolId = this.data.schoolId
    this.findWeekCourse(userId, schoolId)
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
    var userId = this.data.userId
    var schoolId = this.data.schoolId
    this.setData({ courseInfoList:[],pageNum:1})
    this.findWeekCourse(userId, schoolId)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var userId = this.data.userId
    var schoolId = this.data.schoolId
    this.findWeekCourse(userId, schoolId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  findWeekCourse: function (userId, schoolId){
    console.log("userId-----" + userId + "-----schoolId------" + schoolId)
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        wx.request({
          url: app.globalData.baseUrl + "find/courseHourDetail/list",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          data: { userId: userId, lat: latitude, log: longitude, schoolId: schoolId, pageNum: that.data.pageNum, pageSize: 10},
          //data: { userId: userId, schoolId: schoolId },
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
                that.setData({ courseInfoList: that.data.courseInfoList.concat(body.courseInfoList), schoolList: body.schoolList })
                that.setData({ pageNum: that.data.pageNum + 1 })
              }
              
              if (that.data.schoolName ==""){
                that.setData({  schoolName: body.selectedSchool.name })
              }
            } else {
              that.showMessageModal()
            }
          },
          fail: function (res) {
            that.showMessageModal()
          },
          complete: function () {
            wx.stopPullDownRefresh()
          }
        })
      },
      fail: function () {
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
          var userId = that.data.userId
          var shcoolId = that.data.shcoolId
          that.findWeekCourse(userId, shcoolId)
        }
      }
    })
  },
  bindPickerSchool: function (e) {
    var userId = this.data.userId
    var index = e.detail.value
    var schoolListItem = this.data.schoolList[index]
    this.setData({ shcoolId: schoolListItem.id, schoolName: schoolListItem.name})
    this.setData({ courseInfoList: [], pageNum: 1 })
    this.findWeekCourse(userId,schoolListItem.id)
  }
})