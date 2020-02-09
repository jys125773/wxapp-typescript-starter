Component({
  externalClasses: ['custom-class'],
  options: {
    multipleSlots: true,
  },
  properties: {
    items: {
      type: Array,
      value: [],
      observer() {
        if (this.mounted) {
          this.setPositions();
        }
      },
    },
    columns: {
      type: Number,
      value: 4,
    },
    itemHeight: {
      type: Number,
      value: 100,
      observer() {
        if (this.mounted) {
          this.setPositions();
        }
      },
    },
  },
  data: {
    dragIndex: -1,
    hoverIndex: -1,
    prevHoverIndex: -1,
    positions: [],
    start: null,
    wrapRect: null,
    transition: false,
    wrapHeight: 'auto',
  },
  attached() {
    this.setPositions();
  },
  ready() {
    this.setContainerRect();
    this.mounted = true;
  },
  methods: {
    setContainerRect() {
      this.createSelectorQuery()
        .select('.ui-sortable')
        .boundingClientRect(rect => {
          const { columns, items, itemHeight } = this.data;
          const wrapHeight =
            Math.ceil(items.length / columns) * itemHeight + 'px';
          this.setData({ wrapHeight, wrapRect: rect });
        })
        .exec();
    },
    setPositions(sorts?: any) {
      const { items, columns, itemHeight } = this.data;
      const positions: { transform: string; index: number }[] = [];
      sorts = sorts || items.map((_, index) => index);
      sorts.forEach(index => {
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
    onLongPress(params) {
      const { index, pageX, pageY, translateX, translateY } = params;
      const start = { pageX, pageY, translateX, translateY };
      this.setData({
        dragIndex: index,
        start,
        transition: true,
      });
      wx.vibrateShort();
    },
    onTouchMove({ translateX, translateY }) {
      const { prevHoverIndex, dragIndex, items } = this.data;
      const hoverIndex = this.calculateTargetIndex(translateX, translateY);
      if (hoverIndex !== prevHoverIndex && !items[hoverIndex].fixed) {
        this.data.prevHoverIndex = hoverIndex;
        this.insert(dragIndex, hoverIndex);
      }
    },
    onTouchEnd() {
      const { items, positions } = this.data;
      this.setData({
        start: null,
        dragIndex: -1,
        transition: false,
      });
      const sortItems: any[] = [];
      positions.forEach(({ index }, i) => {
        sortItems[index] = items[i];
      });
      this.triggerEvent('change', { items: sortItems });
    },
    insert(start, end) {
      const { positions, items } = this.data as any;
      if (start < end) {
        const sorts = positions.map((_, index) => {
          if (items[index].fixed) {
            return index;
          } else if (index > start && index <= end) {
            return this.getNextIndex(index - 1, start);
          } else if (index === start) {
            return end;
          }
          return index;
        });
        this.setPositions(sorts);
      } else if (start > end) {
        const sorts = positions.map((_, index) => {
          if (items[index].fixed) {
            return index;
          } else if (index < start && index >= end) {
            return this.getPrevIndex(index + 1, start);
          } else if (index === start) {
            return end;
          }
          return index;
        });
        this.setPositions(sorts);
      } else {
        this.setPositions();
      }
      wx.vibrateShort();
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
      const { columns, items, itemHeight, wrapRect } = this.data as any;
      const count = items.length;
      const itemWidth = wrapRect.width / columns;
      const rows = Math.ceil(count / columns) - 1;
      let i = Math.round(translateX / itemWidth);
      let j = Math.round(translateY / itemHeight);
      i = i > columns - 1 ? columns - 1 : i;
      i = i < 0 ? 0 : i;
      j = j < 0 ? 0 : j;
      j = j > rows ? rows : j;
      let hoverIndex = i + columns * j;
      hoverIndex = hoverIndex >= count ? count - 1 : hoverIndex;
      return hoverIndex;
    },
  },
});
