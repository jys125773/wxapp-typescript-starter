Page({
  data: {
    rate1: 0,
    rate2: 1.5,
    rate3: 3,
    rate4: 2,
  },
  change(e) {
    const { target: { dataset: { key } }, detail: { value } } = e;
    this.setData({ [key]: value });
  }
})