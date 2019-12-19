Page({
  data: {
    transitionName: '',
    in: false,
  },
  animate(e) {
    const { type } = e.target.dataset;
    this.setData({
      in: true,
      transitionName: type,
    });
  },
  afterEnter() {
    setTimeout(() => {
      this.setData({ in: false });
    }, 600);
  },
  afterLeave() {},
});
