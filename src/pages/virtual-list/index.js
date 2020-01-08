const list = Array.from({ length: 10000 }).map((_, index) => index);

Page({
  data: {
    itemSize: index => 50 * (index % 2 === 0 ? 2 : 1),
    styleItems: null,
    list,
  },
  onReady() {
    this.virtualListRef =
      this.virtualListRef || this.selectComponent('#virtual-list');
  },

  slice(e) {
    const { startIndex, stopIndex, styleItems } = e.detail;
    this.setData({
      list: list.slice(startIndex, stopIndex),
      styleItems,
    });
  },
});
