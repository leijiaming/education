// pages/videoclassdetail/videoclassdetail.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentChoose: 0,
    id:null,
    videoData:null,
    autoplay:false,
    head:null,
    userId:null,
    comment: null,
    commentList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo !=null){
      var headImg = app.globalData.userInfo.headImg
      this.setData({head: headImg })
    }
    var userId = app.globalData.userId
    this.setData({ userId: userId })
    this.setData({ id: options.id})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var id = this.data.id
      this.findVideoInfo(id)
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
  findVideoInfo:function(id){
    var that = this
    var userId = this.data.userId
    console.log(userId+"------------")
    wx.request({
      url: app.globalData.baseUrl + "find/courseVideo/single",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { id: id, userId: userId},
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({ videoData: body })
          that.setData({ commentList: body.commentList })

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
          that.findVideoInfo(id)
        }
      }
    })
  },
  play:function(){
    var videoData = this.data.videoData
    var buyStatus = videoData.buyStatus
    if(buyStatus == 1){
      this.setData({ autoplay: true })
    } else if (videoData.videoCouponList.length == 0){
      var fee = this.data.videoData.fee
      this.submitOrder(fee, fee, null)
    }
  },
  end:function(){
    this.setData({ autoplay: false})
  },
  onItemClick:function(res){
      var id = res.currentTarget.dataset.id
      //this.setData({ videoData: null, id: id, autoplay:false })
      //this.findVideoInfo(id)
      wx.redirectTo({
        url: '../videoclassdetail/videoclassdetail?id=' + id,
      })
  },
  gocomment: function () {
    var comment = this.data.comment
    if (comment == null || comment.trim() == '') {
      wx.showToast({
        title: '评论内容为空',
      })
      return
    }
    var userId = this.data.userId
    var id = this.data.id
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "save/update/comment",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { userId: userId, content: comment, commentType: '2', itemId: id },
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({ comment: null })
          that.findCommentList()
        } else {

        }
      },
      fail: function (res) {

      }
    })
  },
  iComment: function (res) {
    console.log(res)
    this.setData({ comment: res.detail.value })
  },
  findCommentList: function () {
    var userId = this.data.userId
    var id = this.data.id
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/comment/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { userId: userId, commentType: '2', itemId: id, pageNum: 1, pageSize: 100 },
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({ commentList: body })
        } else {

        }
      },
      fail: function (res) {

      }
    })
  },
  bindPickerCoupon:function(e){
    var index = e.detail.value
    var discountPrice = this.data.videoData.videoCouponList[index].discountPrice
    var couponId = this.data.videoData.videoCouponList[index].id
    var fee = this.data.videoData.fee
    var realPrice
    if (discountPrice * 1 >= fee * 1) {
      realPrice = 0
    } else {
      realPrice= fee * 1 - discountPrice * 1
    }
    this.submitOrder(realPrice, fee, couponId)
  },
  pickerCancle:function(){
    var fee = this.data.videoData.fee
    this.submitOrder(fee,fee,null)
  },
  submitOrder: function (realFee, fee, couponId) {
    var that = this
    var userId = this.data.userId
    var videoId =this.data.id
    console.log("userId==" + userId)
    console.log("videoId==" + videoId)
    console.log("realFee==" + realFee)
    console.log("fee==" + fee)
    console.log("couponId==" + couponId)
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log("code==" + res.code)
          wx.request({
            url: app.globalData.baseUrl + "save/update/order",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              userId: userId,
              orderType: "2",
              videoId: videoId,
              realFee: realFee,
              fee: fee,
              couponId: couponId,
              code: res.code
            },
            method: "POST",
            success: function (res) {
              console.log(res)
              var resultCode = res.data.resultCode
              if (resultCode == 1000) {
                var code = res.data.body.code
                var message = res.data.body.message
                wx.showToast({
                  title: message,
                })
                if (code == 1) {
                  if (realFee != 0) {
                    that.payMoney(res.data.body.prePayInfo)
                  }
                } else {
                  var id = that.data.id
                  //this.setData({ videoData: null, id: id, autoplay:false })
                  //this.findVideoInfo(id)
                  wx.redirectTo({
                    url: '../videoclassdetail/videoclassdetail?id=' + id,
                  })
                }
              } else if(code == 2){
                var videoData = that.data.videoData
                var buyStatus = videoData.buyStatus
                videoData.buyStatus = 1
                that.setData({ videoData: videoData })
                that.setData({ autoplay: true })
              }
            },
            fail: function (res) {

            }
          })
        }
      }
    })
  },
  payMoney: function (prePayInfo) {
    var that = this
    wx.requestPayment({
      'timeStamp': prePayInfo.timeStamp,
      'nonceStr': prePayInfo.nonceStr,
      'package': prePayInfo.package_,
      'signType': 'MD5',
      'paySign': prePayInfo.paySign,
      'success': function (res) {
        wx.showModal({
          title: '支付成功',
          showCancel: false
        });
        var id = that.data.id
        //this.setData({ videoData: null, id: id, autoplay:false })
        //this.findVideoInfo(id)
        wx.redirectTo({
          url: '../videoclassdetail/videoclassdetail?id=' + id,
        })
      },
      'fail': function (res) {
        wx.showModal({
          title: '支付失败',
          showCancel: false
        });
      }
    })
  },
})