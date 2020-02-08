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
    previousTargetIndex: -1,
    translateX: 0,
    translateY: 0,
    positions: [],
    widthTransition: false,
    startTouch: null,
  },
  attached() {
    this.setPositions();
  },
  ready() {
    this.setContainerRect();
  },
  methods: {
    setContainerRect() {
      this.createSelectorQuery()
        .select('.ui-sortable-list')
        .boundingClientRect(rect => {
          this.containerRect = rect;
        })
        .exec();
    },
    setPositions(sorts?: any) {
      const { items, columns, itemHeight } = this.data;
      const positions: { transform: string; index: number }[] = [];
      sorts = sorts || items.map((_, index) => ({ index }));
      sorts.forEach(({ index }) => {
        const { x, y } = this.getCoordinate(index, columns);
        const transform = `translate3d(${100 * x}%,${itemHeight * y}px,0);`;
        positions.push({
          transform: `transform:${transform};-webkit-transform:${transform}`,
          index,
        });
      });
      this.setData({ positions });
    },
    getCoordinate(index, columns) {
      return {
        x: index % columns,
        y: Math.floor(index / columns),
      };
    },
    onLongPress(e) {
      const {
        touches: [{ pageX, pageY }],
        target: {
          dataset: { index },
        },
      } = e;
      const { items, columns, itemHeight } = this.data;
      if (items[index].fixed) return;
      const { left, top, width: containerWidth } = this.containerRect;
      const itemWidth = containerWidth / columns;
      const startTranslateX = columns > 1 ? pageX - left - 0.5 * itemWidth : 0;
      const startTranslateY = pageY - top - 0.5 * itemHeight;
      const startTouch = {
        pageX,
        pageY,
        translateX: startTranslateX,
        translateY: startTranslateY,
      };
      this.setData({
        startTouch,
        dragIndex: index,
        translateX: startTranslateX,
        translateY: startTranslateY,
        widthTransition: false,
      });
    },
    onTouchEnd() {
      this.setData({
        startTouch: null,
        widthTransition: false,
      });
    },
    observeTouchMove({ translateX, translateY }) {
      const { previousTargetIndex, dragIndex } = this.data;
      const targetIndex = this.calculateTargetIndex(translateX, translateY);
      if (targetIndex !== previousTargetIndex) {
        this.data.previousTargetIndex = targetIndex;
        this.insert(dragIndex, targetIndex);
      }
    },
    insert(start, end) {
      const { positions, items, widthTransition } = this.data as any;
      if (!widthTransition) {
        this.setData({ widthTransition: true });
      }
      if (start < end) {
        const sorts = positions.map((_, index) => {
          if (items[index].fixed) {
            return { index };
          } else if (index > start && index <= end) {
            return { index: this.getNextIndex(index - 1, start) };
          } else if (index === start) {
            return { index: end };
          }
          return { index };
        });
        this.setPositions(sorts);
      } else if (start > end) {
        const sorts = positions.map((_, index) => {
          if (items[index].fixed) {
            return { index };
          } else if (index < start && index >= end) {
            return { index: this.getPrevIndex(index + 1, start) };
          } else if (index === start) {
            return { index: end };
          }
          return { index };
        });
        this.setPositions(sorts);
      } else {
        this.setPositions();
      }
    },
    getNextIndex(index, start) {
      if (index === start) {
        return start;
      } else if (this.data.items[index].fixed) {
        return this.getNextIndex(index - 1, start);
      } else {
        return index;
      }
    },
    getPrevIndex(index, start) {
      if (index === start) {
        return start;
      } else if (this.data.items[index].fixed) {
        return this.getPrevIndex(index + 1, start);
      } else {
        return index;
      }
    },
    calculateTargetIndex(translateX, translateY) {
      const { columns, items, itemHeight } = this.data;
      const count = items.length;
      const itemWidth = this.containerRect.width / columns;
      const rows = Math.ceil(count / columns) - 1;
      let i = Math.round(translateX / itemWidth);
      let j = Math.round(translateY / itemHeight);
      i = i > columns - 1 ? columns - 1 : i;
      i = i < 0 ? 0 : i;
      j = j < 0 ? 0 : j;
      j = j > rows ? rows : j;
      let targetIndex = i + columns * j;
      targetIndex = targetIndex >= count ? count - 1 : targetIndex;
      return targetIndex;
    },
  },
});
