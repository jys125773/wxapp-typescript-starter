import cateList from './config';

Page({
  data: {
    cateList,
  },
  jumpUrl(e) {
    const { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
  },
});
