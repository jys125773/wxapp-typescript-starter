Page({
  data: {
    container: null,
  },
  onLoad() {
    this.setData({
      container: () => wx.createSelectorQuery().select('.box-c'),
    });
  },
});
