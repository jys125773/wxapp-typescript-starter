Component({
  externalClasses: ['custom-class'],
  options: {
    multipleSlots: true,
  },
  properties: {
    items: {
      type: Array,
      value: [],
    },
    columns: {
      type: Number,
      value: 4,
    },
    itemHeight: {
      type: Number,
      value: 100,
    },
  },
  data: {
    dragIndex: -1,
    translateX: 0,
    translateY: 0,
    startTranslateX: 0,
    startTranslateY: 0,
    startPageX: 0,
    startPageY: 0,
    transforms: [],
    startIdentifier: 0,
  },
  ready() {
    this.createSelectorQuery()
      .select('.ui-sortable-list')
      .boundingClientRect(rect => {
        // console.log(rect);
      })
      .exec();
  },
  methods: {
    onItemlongPress(e) {
      const {
        touches: [{ pageX, pageY, identifier }],
        target: {
          dataset: { index },
        },
      } = e;
      const { items, columns } = this.data;
      const { sortId } = items[index];

      this.createSelectorQuery()
        .select(`.item-${sortId}`)
        .boundingClientRect(rect => {
          const startTranslateX =
            columns > 1 ? pageX - rect.width / 2 - rect.left : 0;
          const startTranslateY = pageY - rect.height / 2 - rect.top;

          this.setData({
            dragIndex: index,
            translateX: startTranslateX,
            translateY: startTranslateY,
            startTranslateX,
            startTranslateY,
            startPageX: pageX,
            startPageY: pageY,
            startIdentifier: identifier,
          });
          wx.vibrateShort();
        })
        .exec();

      // this.setData({
      //   dragIndex: index,
      //   translateX: 0,
      //   translateY: 0,
      //   startTranslateX: 0,
      //   startTranslateY: 0,
      //   startPageX: pageX,
      //   startPageY: pageY,
      // });
    },
    onItemTouchMove(e) {
      const {
        touches: [{ pageX, pageY, identifier }],
      } = e;
      const {
        startPageX,
        startPageY,
        startTranslateX,
        startTranslateY,
        startIdentifier,
      } = this.data;

      if (identifier !== startIdentifier) return;

      this.setData({
        translateX: startTranslateX + pageX - startPageX,
        translateY: startTranslateY + pageY - startPageY,
      });
      // console.log('translateX', startTranslateX + pageX - startPageX);
      // console.log('translateY', startTranslateY + pageY - startPageY);
      
    },
  },
});
