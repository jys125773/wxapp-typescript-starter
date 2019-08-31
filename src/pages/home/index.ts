interface IData {
  current: number;
}

Page<IData, any>({
  data: {
    current: 0,
  },
  bindChange(e) {
    const { current } = e.detail;
    this.setData({ current }, () => {});
  },
});
