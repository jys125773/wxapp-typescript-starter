Component({
  externalClasses: [
    'custom-class',
    'line-class',
    'tab-class',
    'tab-active-class',
  ],
  relations: {
    '../tab/index': {
      type: 'child',
      linked(target) {
        if (this.tabs) {
          this.tabs.push(target);
        } else {
          this.tabs = [target];
        }
        if (this.mounted) {
          this.setChildren();
        }
      },
      unlinked(target) {
        const index = this.tabs.findIndex(i => i === target);
        if (index !== -1) {
          this.tabs.splice(index, 1);
          if (this.mounted) {
            this.setChildren();
          }
        }
      },
    },
  },
  properties: {
    current: {
      type: Number,
      value: 0,
      observer(index) {
        if (this.mounted) {
          this.setTabs(index, false);
        }
      },
    },
    swipable: {
      type: Boolean,
      value: true,
    },
    srollableThreshold: {
      type: Number,
      value: 4,
    },
    touchThreshold: {
      type: Number,
      value: 20,
    },
    duration: {
      type: Number,
      value: 200,
    },
    switchWithAnimation: {
      type: Boolean,
      value: false,
    },
    linePadding: {
      type: Number,
      value: 8,
    },
  },
  data: {
    srollable: false,
    skipAnimation: true,
    lineStyle: '',
    trackStyle: '',
    scrollLeft: 0,
    children: [],
  },

  mounted: false,
  startX: 0,
  startY: 0,
  deltaX: 0,
  deltaY: 0,

  ready() {
    this.mounted = true;
    this.setChildren();
  },
  methods: {
    bindTouchStart(e) {
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
    },
    bindTouchEnd(e) {
      const {
        startX,
        startY,
        data: { touchThreshold, current, children },
      } = this;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (Math.abs(deltaX / deltaY) > 1) {
        if (deltaX > touchThreshold) {
          this.triggerEvent('change', {
            current: current >= 1 ? current - 1 : 0,
          });
        } else if (deltaX < -touchThreshold) {
          const len = children.length;
          this.triggerEvent('change', {
            current: current <= len - 2 ? current + 1 : len - 1,
          });
        }
      }
    },
    setChildren() {
      const { current, srollableThreshold } = this.data;
      const children = this.tabs.map(i => i.data);
      const srollable = children.length > srollableThreshold;
      this.setData({ children, srollable }, () => {
        this.setTabs(current, true);
      });
    },
    setTabs(index: number, skipAnimation = false) {
      const {
        duration,
        linePadding,
        switchWithAnimation,
        srollableThreshold,
      } = this.data;
      const selQuery = this.createSelectorQuery();
      selQuery.select('.tabs__content').boundingClientRect();
      selQuery.select(`.tabs__nav-item-${index}`).boundingClientRect();
      selQuery.select(`.tabs__nav-text-${index}`).boundingClientRect();
      selQuery.exec(res => {
        const contentWidth = res[0] && res[0].width;
        const navItemWidth = res[1] && res[1].width;
        const navTextWidth = res[2] && res[2].width;
        if (contentWidth && navItemWidth && navTextWidth) {
          const lineLeft =
            navItemWidth * index +
            (navItemWidth - navTextWidth) / 2 -
            linePadding;
          const lineWidth = navTextWidth + linePadding * 2;
          const lineDuration = skipAnimation ? 0 : duration;
          const lineStyle = `width:${lineWidth}px;
          left:${lineLeft}px;
          transition:all ${lineDuration}ms;
          -webkit-transition:all ${lineDuration}ms`;

          const trackLeft = -index * contentWidth;
          const trackDuration =
            skipAnimation || !switchWithAnimation ? 0 : duration;
          const trackStyle = `width:${-trackLeft}px;
          transform:translateX(${trackLeft}px);
          -webkit-transform:translateX(${trackLeft}px);
          transition:all ${trackDuration}ms;
          -webkit-transition:all ${trackDuration}ms`;

          const scrollLeft =
            Math.ceil(index - srollableThreshold / 2) * navItemWidth;

          this.setData({
            lineStyle,
            trackStyle,
            scrollLeft,
            skipAnimation,
          });

          this.tabs.forEach((tab, idx) => {
            const inited = tab.data.inited || index === idx;
            tab.update({ width: contentWidth, inited });
          });
        }
      });
    },
    bindTap(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('change', { current: index });
    },
  },
});
