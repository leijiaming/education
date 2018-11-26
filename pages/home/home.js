// pages/home/home.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    indicatorColor: "#d1d1d1",
    indicatorActiveColor: "#6699FF",
    noticeIcon: "../images/icon-notice@3x.png",
    newsIcon:"../images/index-icon-xwdt-normal@2x.png",
    classIcon:"../images/index-icon-kcjs-normal@2x.png",
    freeIcon:"../images/index-icon-mfkc-normal@2x.png",
    weekIcon:"../images/index-icon-bzkc-normal@2x.png",
    searchIcon:"../images/index-icon-fxcx-normal@2x.png",
    teacherIcon:"../images/index-icon-msjj-normal@2x.png",
    feeIcon:"../images/index-icon-bmfy-normal@2x.png",
    usIcon:"../images/index-icon-lxwm-normal@2x.png",
    bannerList:null,
    hotCourseList:null,
    noticeList:null,
    notice:"",
    currentNoticeIndex:0,
    intervalNotice:null,
    aboutUsUrl:null
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
      this.findHomePageData()
      this.startNotice()
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
    var intervalNotice = this.data.intervalNotice
    if (intervalNotice !=null){
      clearInterval(intervalNotice)
    }
    this.findHomePageData()
    this.startNotice()
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
  onItemClick: function (data) {
    switch (data.currentTarget.dataset.index) {
      case '0':
        wx.navigateTo({
          url: '../news/news',
        })
        break
      case '1':
        wx.navigateTo({
          url: '../courseintroduction/courseintroduction',
        })
        break
      case '2':
        wx.navigateTo({
          url: '../freecourse/freecourse',
        })
        break
      case '3':
        var userId = app.globalData.userId
        if(userId !=null){
          wx.navigateTo({
            url: '../weekcourse/weekcourse?userId='+userId+"&choose=0",
          })
        }else{
          wx.showToast({
            title: '请登录',
          })
         wx.switchTab({
           url: '../mine/mine',
         })
        }
        break
      case '4':
        wx.navigateTo({
          url: '../campusinquiries/campusinquiries',
        })
        break
      case '5':
        wx.navigateTo({
          url: '../teacher/teacher',
        })
        break
      case '6': 
        var userId = app.globalData.userId
        if (userId != null) {
          wx.navigateTo({
            url: '../courseenrollment/courseenrollment?fromType=3',
          })
        }else{
          wx.showToast({
            title: '请登录',
          })
          wx.switchTab({
            url: '../mine/mine',
          })
        }
        break
      case '7':
        var detailUrl = this.data.aboutUsUrl
        wx.navigateTo({
          url: '../detail/detail?detailUrl=' + detailUrl,
        })
        break
    }
  },
  onHotItemClick:function(res){
    var userId = app.globalData.userId
    if (userId != null) {
      var id = res.currentTarget.dataset.id
      wx.navigateTo({
        url: '../classdetail/classdetail?id=' + id,
      })
    } else {
      wx.showToast({
        title: '请登录',
      })
      wx.switchTab({
        url: '../mine/mine',
      })
    }
    
  },
  findHomePageData: function(){
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/index/page/banner/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var bannerList = res.data.body.bannerList
          var hotCourseList = res.data.body.hotCourseList
          var noticeList = res.data.body.noticeList
          var aboutUsUrl = res.data.body.aboutUsUrl
          that.setData({ bannerList: bannerList, hotCourseList: hotCourseList, noticeList: noticeList,
            aboutUsUrl: aboutUsUrl})
        } else {
          that.showHomePageMessageModal()
        }
      },
      fail: function (res) {
        that.showHomePageMessageModal()
      },
      complete:function(){
        wx.stopPullDownRefresh()
      }
    })
  },
  showHomePageMessageModal: function () {
    var that = this
    wx.showModal({
      title: '提示',
      cancelText: "取消",
      confirmText: "重新获取",
      content: '获取数据失败',
      success: function (res) {
        if (res.confirm) {
          that.findHomePageData()
        }
      }
    })
  },
  startNotice:function(){
    var that = this
    var i = 0
    var intervalNotice = setInterval(function () {
      var noticeList = that.data.noticeList
      if (noticeList != null && noticeList.length > 0) {
        if (i == noticeList.length) {
          i = 0
        }
        that.setData({ notice: noticeList[i].title, currentNoticeIndex:i })
        i++
      }
    }, 3000) 
    this.setData({ intervalNotice: intervalNotice})
  },
  onBannerItenClick:function(res){
    var index = res.target.dataset.index
    var bannerList = this.data.bannerList
    var detailUrl = bannerList[index].detailUrl
      wx.navigateTo({
        url: '../detail/detail?detailUrl='+detailUrl,
      })
  },
  onNoticeItemClick:function(){
    var currentNoticeIndex = this.data.currentNoticeIndex
    var detailUrl = this.data.noticeList[currentNoticeIndex].detailUrl
    wx.navigateTo({
      url: '../detail/detail?detailUrl=' + detailUrl,
    })
  }
})