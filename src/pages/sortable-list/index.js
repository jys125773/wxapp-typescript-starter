Page({
  data: {
    sortableList: [
      {
        sortId: 0,
        color: 'rgba(255, 0, 0, 1)',
      },
      {
        sortId: 1,
        color: 'rgba(215, 30, 40, 1)',
      },
      {
        sortId: 2,
        color: 'rgba(175, 60, 80, 1)',
        fixed: true,
      },
      {
        sortId: 3,
        color: 'rgba(135, 90, 120, 1)',
      },
      {
        sortId: 4,
        color: 'rgba(95, 120, 160, 1)',
      },
      {
        sortId: 5,
        color: 'rgba(55, 150, 200, 1)',
      },
      {
        sortId: 6,
        color: 'rgba(15, 180, 240, 1)',
      },
    ],
  },
  bindSortChange(e) {
    this.setData({ sortableList: e.detail.items });
  },
});
