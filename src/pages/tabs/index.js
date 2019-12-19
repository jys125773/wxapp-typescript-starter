Page({
  data: {
    activeTab: 1,
  },
  change(e) {
    const {
      detail: { active },
    } = e;
    this.setData({
      activeTab: active,
    });
  },
});
