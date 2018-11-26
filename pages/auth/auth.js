// pages/courseenrollment/courseenrollment.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classListItem: null,
    schoolListItem: null,
    classList: null,
    schoolList: null,
    name: null,
    phone: null,
    pubgrade: null,
    pubschool: null,
    contacts: null,
    body:null
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
    this.findCourseBuyInfo()
  
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
  submit: function () {
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
    if (name == null || name == '') {
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
    this.submitUserInfo(name, pubschool, pubgrade, contacts, phone)
  },
  submitUserInfo: function (name, pubschool, pubgrade, contacts, phone) {
    var that = this
    var userId = app.globalData.userId
    var classId = this.data.classListItem.id
    var schoolId = this.data.schoolListItem.id
    wx.request({
      url: app.globalData.baseUrl + "/save/update/member/info",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId,
        schoolId: schoolId,
        classId: classId,
        stuName: name,
        publicSchoolName: pubschool,
        publicGrade: pubgrade,
        contactsName: contacts,
        phoneNumber: phone,
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          wx.showToast({
            title: "提交成功",
          })
          wx.navigateBack()
        } else {
          wx.showToast({
            title: "提交失败",
          })
        }
      },
      fail: function (res) {

      }
    })
  },
  findUserMemberInfo:function(){
    var that = this
    var userId = app.globalData.userId
    wx.request({
      url: app.globalData.baseUrl + "/find/user/member/info",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId,
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          if (JSON.stringify(body) == "{}"){
            that.setData({ body: null })
          }else{

  
              that.setData({body:body})
            that.setData({
              name: body.stuName,
              phone: body.phoneNumber,
              pubschool: body.publicSchoolName,
              pubgrade: body.publicGrade,
              contacts: body.contactsName,
            })
            var schoolId = body.schoolId
            var schoolList = that.data.schoolList
          
            for (var i = 0; i < schoolList.length; i++) {
              if (schoolId == schoolList[i].id) {
                that.setData({
                  schoolListItem:schoolList[i]
                })
             
              }
            }
            that.findCourseClassList(schoolId)
            
          }
        }
      },
      fail: function (res) {

      }
    })
  },
  findCourseBuyInfo: function () {
    var that = this
    var userId = app.globalData.userId
    wx.request({
      url: app.globalData.baseUrl + "find/course/buyInfo",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        userId: userId,
        fromType: '3',
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({
            classList: body.classList,
            schoolList: body.schoolList,
          })
          
          that.findUserMemberInfo()
        } else {

        }
      },
      fail: function (res) {

      }
    })
  },
  bindPickerSchool: function (e) {
    var index = e.detail.value
    var schoolListItem = this.data.schoolList[index]
    this.setData({
      schoolListItem: schoolListItem,
      classListItem: null
    })
    this.findCourseClassList(schoolListItem.id)
  },
  bindPickerClass: function (e) {
    var index = e.detail.value
    var classListItem = this.data.classList[index]
    this.setData({
      classListItem: classListItem
    })
  },
  findCourseClassList: function (schoolId) {
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
      success: function (res) {
        console.log(res)
        var resultCode = res.data.resultCode
        if (resultCode == 1000) {
          var body = res.data.body
          that.setData({
            classList: body
          })
          if(that.data.body !=null){
            var classId = that.data.body.classId
          var classList = that.data.classList
          for (var i = 0; i < classList.length; i++) {
            console.log(classId + "------" + classList[i].id)
            if (classId == classList[i].id) {
              that.setData({
                classListItem: classList[i]
              })
            }
          }
          }
        } else {

        }
      },
      fail: function (res) {

      }
    })
  },
  iName: function (res) {
    this.setData({ name: res.detail.value })
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

  sub: function (num1, num2) {
    var r1, r2, m, n;
    try { r1 = num1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = num2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    n = (r1 >= r2) ? r1 : r2;
    m = Math.pow(10, Math.max(r1, r2));
    return ((num1 * m - num2 * m) / m).toFixed(n);
  }
})