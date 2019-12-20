Page({
  data: {

  },
  change(e) {
    const {
      detail: { active },
      target: { dataset: { index } }
    } = e;
    this.setData({
      [`activeTab${index}`]: active,
    });
  },
});
