Page({
  data: {
    centerShow: false,
    leftShow: false,
    rightShow: false,
    topShow: false,
    bottomShow: false,
    customPositionShow: false,
    customAnimationShow: false,
  },
  toggle(e) {
    const { position } = e.currentTarget.dataset;
    const showKey = `${position}Show`;
    this.setData({ [showKey]: !this.data[showKey] });
  },
});
