Component({
  options: {
    multipleSlots: true,
  },
  externalClasses: ['custom-class'],
  properties: {
    disabled: {
      type: Boolean,
      value: false,
    },
    leftWidth: {
      type: Number,
      value: 0,
    },
    rightWidth: {
      type: Number,
      value: 0,
    },
    threshold: {
      type: Number,
      value: 0.3,
    },
    duration: {
      type: Number,
      value: 400,
    },
    // -1,左边打开；0，关闭；1，右边打开
    status: {
      type: Number,
      value: 0,
      observer(value) {
        if (value === 0) {
          this.close();
        } else if (value === -1) {
          this.open('left');
        } else if (value === 1) {
          this.open('right');
        }
      },
    },
  },
  data: {
    offsetX: 0,
    transitionDration: 0,
    touchMoving: false,
    swipeLocked: false,
  },
  startX: 0,
  startOffsetX: 0,
  mounted: false,
  ready() {
    this.mounted = true;
  },
  methods: {
    bindTouchStart(e) {
      const { offsetX } = this.data;
      const touch = e.touches[0];
      this.startOffsetX = offsetX;
      this.startX = touch.clientX;
      this.startY = touch.clientY;
      this.setData({ touchMoving: true, swipeLocked: false });
    },
    bindTouchMove(e) {
      const {
        data: { leftWidth, rightWidth, touchMoving, swipeLocked },
        startOffsetX,
        startX,
        startY,
      } = this;
      const touch = e.touches[0];
      const deltaX = startX - touch.clientX;
      const deltaY = startY - touch.clientY;
      const offsetX = startOffsetX + deltaX;

      if (!touchMoving || swipeLocked) {
        return;
      }

      if (
        Math.abs(deltaY / deltaX) > 1 ||
        offsetX > rightWidth ||
        offsetX < -leftWidth
      ) {
        if (!swipeLocked) {
          this.setData({ swipeLocked: true });
        }
        return;
      }

      this.setData({ offsetX, swipeLocked: false });
    },
    bindTouchEnd() {
      const { offsetX, threshold, leftWidth, rightWidth, duration } = this.data;
      const swipeToRight = offsetX - this.startOffsetX < 0;
      let ratio = 0;

      if (offsetX > 0) {
        if (
          (offsetX > rightWidth * threshold && !swipeToRight) ||
          (offsetX > rightWidth * (1 - threshold) && swipeToRight)
        ) {
          ratio = (rightWidth - offsetX) / rightWidth;
          this.setData({
            offsetX: rightWidth,
            transitionDration: duration * ratio,
            touchMoving: false,
          });
          this.triggerEvent('change', { status: 1 });
        } else {
          ratio = offsetX / rightWidth;
          this.setData({
            offsetX: 0,
            transitionDration: duration * ratio,
            touchMoving: false,
          });
          this.triggerEvent('change', { status: 0 });
        }
      } else if (offsetX < 0) {
        if (
          (offsetX < -leftWidth * threshold && swipeToRight) ||
          (offsetX < -leftWidth * (1 - threshold) && !swipeToRight)
        ) {
          ratio = (leftWidth + offsetX) / leftWidth;
          this.setData({
            offsetX: -leftWidth,
            transitionDration: duration * ratio,
            touchMoving: false,
          });
          this.triggerEvent('change', { status: -1 });
        } else {
          ratio = -offsetX / leftWidth;
          this.setData({
            offsetX: 0,
            transitionDration: duration * ratio,
            touchMoving: false,
          });
          this.triggerEvent('change', { status: 0 });
        }
      }
    },
    open(direction: 'left' | 'right' = 'right') {
      const { leftWidth, rightWidth, duration } = this.data;
      const update: any = {
        touchMoving: false,
        transitionDration: this.mounted ? duration : 0,
      };
      if (direction === 'left') {
        update.offsetX = -leftWidth;
        this.triggerEvent('change', { status: -1 });
      } else if (direction === 'right') {
        this.triggerEvent('change', { status: 1 });
        update.offsetX = rightWidth;
      }

      if (typeof update.offsetX === 'number') {
        this.setData(update);
      }
    },
    close() {
      const { duration } = this.data;
      this.setData({
        touchMoving: false,
        transitionDration: this.mounted ? duration : 0,
        offsetX: 0,
      });
      this.triggerEvent('change', { status: 0 });
    },
    noop() {},
  },
});
