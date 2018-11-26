// pages/myinfo/myinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo:null,
      chooseItem:0,
      nextIcon: "../images/arrow-r.png"
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
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 1];//当前页
    var prevPage = pages[pages.length - 2];  //上一个页面
    var userInfo = prevPage.data.userInfo //取上页data里的数据也可以修改
    this.setData({ userInfo: userInfo })
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
  onItemClick:function(res){
    console.log(res)
    var index = res.currentTarget.dataset.index
    if(index !='0'){
      this.setData({ chooseItem:index})
      wx.navigateTo({
        url: '../reviseinfo/reviseinfo',
      })
    }
  }
})