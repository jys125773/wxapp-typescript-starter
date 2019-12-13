Page({
  data: {
    value: 1.5
  },
  change(e) {
    const { detail: { value } } = e;
    this.setData({ value });
  }
})