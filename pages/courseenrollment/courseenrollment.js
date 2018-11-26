// pages/courseenrollment/courseenrollment.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classListItem: null,
    couponListItem: null,
    schoolListItem: null,
    userInfo: null,
    classList: null,
    couponList: null,
    schoolList: null,
    realPrice: 0,
    name:null,
    phone:null,
    pubgrade: null,
    pubschool: null,
    contacts: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var fromType = options.fromType
    this.setData({
      fromType: fromType
    })
    if (fromType == '2') {
      var courseId = options.courseId
      this.setData({
        courseId: courseId
      })
      var classId = options.classId
      this.setData({
        classId: classId
      })
      var schoolId = options.schoolId
      this.setData({
        schoolId: schoolId
      })
    }
    if (fromType == '1') {
      var courseId = options.courseId
      console.log(courseId+"----------")
      this.setData({
        courseId: courseId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.findCourseBuyInfo()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  pay: function() {
    var classListItem = this.data.classListItem
    var schoolListItem = this.data.schoolListItem
    if (classListItem == null || schoolListItem == null) {
      wx.showToast({
        title: '请完善信息',
      })
      return
    }
    var name = this.data.name
    var phone = this.data.phone
    var pubgrade = this.data.pubgrade
    var pubschool = this.data.pubschool
    var contacts = this.data.contacts
    if(name ==null || name ==''){
      wx.showToast({
        title: '请完善信息',
      })
      return
    }
    if (phone == null || phone == '') {
      wx.showToast({
        title: '请完善信息',
      })
      return
    }
    if (pubschool == null || pubschool == '') {
      wx.showToast({
        title: '请完善信息',
      })
      return
    }
    if (pubgrade == null || pubgrade == '') {
      wx.showToast({
        title: '请完善信息',
      })
      return
    }
    if (contacts == null || contacts == '') {
      wx.showToast({
        title: '请完善信息',
      })
      return
    }
    this.submitOrder(name, pubschool, pubgrade, contacts, phone)
  },
  submitOrder: function(name, pubschool, pubgrade, contacts, phone) {
    var that = this
    var userId = app.globalData.userId
    var classId = this.data.classListItem.id
    var school = this.data.schoolListItem.id
    var fee = this.data.classListItem.fee
    var realFee = this.data.realPrice
    var couponId = null
    if (this.data.couponListItem != null) {
      couponId = this.data.couponListItem.id
    }
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.baseUrl + "save/update/order",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              userId: userId,
              school: school,
              classId: classId,
              studentName: name,
              publicSchool: pubschool,
              publicGrade: pubgrade,
              contacts: contacts,
              mobile: phone,
              fee: fee,
              orderType: "1",
              realFee: realFee,
              couponId: couponId,
              code: res.code
            },
            method: "POST",
            success: function (res) {
              console.log(res)
              var resultCode = res.data.resultCode
              if (resultCode == 1000) {
                var code = res.data.body.code
                if (code == 1) {
                  if (realFee !=0){
                    that.payMoney(res.data.body.prePayInfo)
                  }
                }
                var message = res.data.body.message
                wx.showToast({
                  title: message,
                })
              } else {

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
    wx.requestPayment({
      'timeStamp': prePayInfo.timeStamp,
      'nonceStr': prePayInfo.nonceStr,
      'package': prePayInfo.package_,
      'signType': 'MD5',
      'paySign': prePayInfo.paySign,
      'success': function(res) {
        wx.showModal({
          title: '支付成功',
          showCancel: false
        });
      },
      'fail': function(res) {
        wx.showModal({
          title: '支付失败',
          showCancel: false
        });
      }
    })
  },
  findCourseBuyInfo: function() {
    var that = this
    var userId = app.globalData.userId
    var classId = this.data.classId
    var courseId = this.data.courseId
    var fromType = this.data.fromType
    var schoolId = this.data.schoolId
    console.log(classId + "--------")
    wx.request({
      url: app.globalData.baseUrl + "find/course/buyInfo",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId,
        classId: classId,
        courseId: courseId,
        fromType: fromType,
        schoolId: schoolId
      },
      method: "POST",
      success: function(res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          if (schoolId != null) {
            for (var i = 0; i < body.schoolList.length; i++) {

              if (schoolId == body.schoolList[i].id) {
                that.setData({
                  schoolListItem: body.schoolList[i]
                })

                break
              }
            }
          }
          if (classId != null) {
            for (var i = 0; i < body.classList.length; i++) {
              if (classId == body.classList[i].id) {
                that.setData({
                  classListItem: body.classList[i]
                })
                that.setData({
                  realPrice: body.classList[i].fee
                })
                break
              }
            }
          }
          that.setData({
            userInfo: body.userInfo,
            classList: body.classList,
            couponList: body.couponList,
            schoolList: body.schoolList,
            name: body.userInfo.studentName,
            phone: body.userInfo.mobile,
            pubschool: body.userInfo.publicSchool,
            pubgrade: body.userInfo.publicGrade,
            contacts: body.userInfo.realName,
          })
        } else {

        }
      },
      fail: function(res) {

      }
    })
  },
  bindPickerSchool: function(e) {
    var index = e.detail.value
    var schoolListItem = this.data.schoolList[index]
    this.setData({
      schoolListItem: schoolListItem,
      classListItem: null,
      couponListItem: null
    })
    this.findCourseClassList(schoolListItem.id)
  },
  bindPickerClass: function(e) {
    var index = e.detail.value
    var classListItem = this.data.classList[index]
    this.setData({
      classListItem: classListItem,
      couponListItem: null
    })
    var userId = this.data.userId
    this.findCouponUserList(classListItem.courseId, userId)
  },
  bindPickerCoupon: function(e) {
    var index = e.detail.value
    var couponListItem = this.data.couponList[index]
    this.setData({
      couponListItem: couponListItem
    })
    var classListItem = this.data.classListItem
    if (couponListItem.discountPrice * 1 >= classListItem.fee * 1) {
      this.setData({
        realPrice: 0
      })
    } else {
      this.setData({
        //realPrice: classListItem.fee * 1 - couponListItem.discountPrice * 1
        realPrice: this.sub(classListItem.fee * 1, couponListItem.discountPrice * 1)
      })
    }
  },
  findCourseClassList: function(schoolId) {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/courseClass/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        schoolId: schoolId
      },
      success: function(res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({
            classList: body
          })
        } else {

        }
      },
      fail: function(res) {

      }
    })
  },
  findCouponUserList: function(courseId, userId) {
    var that = this
    wx.request({
      url: app.globalData.baseUrl + "find/couponUser/list",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: {
        courseId: courseId,
        userId: userId,
        couponStatus: '1'
      },
      success: function(res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({
            couponList: body
          })
          if (body == null || body.length == 0) {
            var classListItem = that.data.classListItem
            that.setData({
              realPrice: classListItem.fee
            })
          }
        } else {

        }
      },
      fail: function(res) {

      }
    })
  },
  iName:function(res){
    this.setData({name:res.detail.value})
  },
  iPubschool: function (res) {
    this.setData({ pubschool: res.detail.value })
  },
  iPubgrade: function (res) {
    this.setData({ pubgrade: res.detail.value })
  },
  iContacts: function (res) {
    this.setData({ contacts: res.detail.value })
  },
  iPhone: function (res) {
    this.setData({ phone: res.detail.value })
  },

  sub: function (num1, num2){
    var r1, r2, m, n;
    try { r1 = num1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = num2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    n = (r1 >= r2) ? r1 : r2;
    m = Math.pow(10, Math.max(r1, r2));
    return ((num1 * m - num2 * m) / m).toFixed(n);
  }
})