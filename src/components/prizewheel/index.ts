Component({
  properties: {
    size: {
      type: Number,
      value: 600,
    },
    duration: {
      type: Number,
      value: 3000,
    },
    turnsNum: {
      type: Number,
      value: 4,
    },
    dataList: {
      type: Array,
      value: [],
      observer(list) {
        this.setItems(list);
      },
    },
  },
  data: {
    items: [],
    animationData: {},
  },
  attached() {
    this.init();
  },
  methods: {
    init() {
      const { duration } = this.data;
      this.rotateAnimation = wx.createAnimation({
        duration,
        timingFunction: 'ease',
      });
      this.resetAnimation = wx.createAnimation({
        duration: 0,
        timingFunction: 'ease',
      });
      this.totalRotateAngle = 0;
      this.sliceIndex = 0;
    },
    setItems(dataList) {
      if (!Array.isArray(dataList)) {
        return;
      }
      const items: any[] = [];
      const { size } = this.data;
      const len = dataList.length;
      const partAngle = 360 / len;
      const sliceWidth = size * Math.sin(((partAngle / 2) * Math.PI) / 180) - 2;
      let probabilityStart = 0;
      let probabilityEnd = 0;
      dataList.forEach((item, index) => {
        probabilityEnd = probabilityStart + item.probability;
        items.push({
          ...item,
          sliceWidth,
          sliceLeft: (size - sliceWidth) / 2,
          sliceAngle: partAngle * index,
          divideAngle: partAngle * (index + 0.5),
          interval: [probabilityStart, probabilityEnd],
        });
        probabilityStart = probabilityEnd;
      });
      this.setData({ items });
    },
    start() {
      const { items, turnsNum } = this.data;
      const randomNum = Math.random();
      const sliceIndex = items.findIndex(
        ({ interval }) => randomNum >= interval[0] && randomNum <= interval[1],
      );
      const partAngle = 360 / items.length;
      this.totalRotateAngle +=
        360 * turnsNum + partAngle * (sliceIndex - this.sliceIndex);
      this.sliceIndex = sliceIndex;

      this.rotateAnimation.rotate(this.totalRotateAngle).step();
      this.setData({ animationData: this.rotateAnimation.export() });
    },
    reset() {
      this.resetAnimation.rotate(0).step();
      this.setData({ animationData: this.resetAnimation.export() });
      this.totalRotateAngle = 0;
    },
    bindAnimationEnd() {},
  },
});
