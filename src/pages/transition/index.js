Page({
  data: {
    in: false,
  },
  toggle() {
    this.setData({
      in: !this.data.in
    });
  }
});