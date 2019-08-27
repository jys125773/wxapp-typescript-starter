interface IData {
  current: number;
}

interface IMethods {
  bindChange(e: any): void;
}

Page({
  data: {
    current: 0,
  },
  bindChange(e) {
    const { current } = e.detail;
    this.setData({ current });
  },
});
