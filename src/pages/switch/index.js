Page({
  data: {
    checked1: true,
    checked2: true,
    checked3: true,
    checked4: true,
    checked5: true,
  },
  change(e) {
    const { target: { dataset: { key } } } = e;
    this.setData({ [key]: !this.data[key] });
  }
})