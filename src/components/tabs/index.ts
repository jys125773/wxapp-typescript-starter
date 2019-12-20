import { debounce } from '../../utils/throttle-debounce';

Component({
  externalClasses: [
    'custom-class',
    'line-class',
    'tab-class',
    'tab-active-class',
    'track-class',
  ],
  relations: {
    '../tab-item/index': {
      type: 'child',
      linked(target) {
        target.index = this.children.length;
        this.children.push(target);
        this.updateTabs();
      },
      unlinked(target) {
        this.children = this.children
          .filter(child => child !== target)
          .map((child, index) => {
            child.index = index;
            return child;
          });
        this.updateTabs();
      },
    },
  },
  properties: {
    active: {
      type: Number,
      value: 0,
      observer() {
        if (this.data.mounted) {
          this.updateChildren();
        }
      },
    },
    swipeable: Boolean,
    swipeableThreshold: {
      type: Number,
      value: 20,
    },
    lineWidth: String,
    lineHeight: String,
    thumbHeight: String,
    lineColor: String,
    titleActiveColor: String,
    titleInactiveColor: String,
    scrollableThreshold: {
      type: Number,
      value: 4,
      observer() {
        this.setData({
          scrollable: this.getScrollable(),
        });
      },
    },
    duration: {
      type: Number,
      value: 300,
    },
    zIndex: {
      type: Number,
      value: 100,
    },
    offsetTop: {
      type: Number,
      value: 0,
    },
    lazy: {
      type: Boolean,
      value: true,
    },
    border: {
      type: Boolean,
      value: true,
    },
    sticky: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    tabs: [],
    scrollable: false,
    trackTranslateX: 0,
    stickyContainer: () => null,
    scrollIntoViewId: '',
    mounted: false,
  },
  created() {
    this.children = [];
    this.updateTabs = debounce(10, function(this: any) {
      this.setData({
        tabs: this.children.map(child => child.data),
        scrollable: this.getScrollable(),
      });
    });
  },
  ready() {
    this.setData({
      mounted: true,
      stickyContainer: () => this.createSelectorQuery().select('.ui-tabs'),
    });
    this.updateChildren();
  },
  methods: {
    getScrollable() {
      const {
        children = [],
        data: { scrollableThreshold },
      } = this;
      return children.length > scrollableThreshold;
    },
    updateChildren() {
      const { active, tabs } = this.data;
      this.children.forEach(target => {
        if (target.index === active) {
          target.update(true);
        } else if (target.data.active) {
          target.update(false);
        }
      });
      if (this.getScrollable()) {
        let scrollIntoViewIndex = active + 1 - Math.floor(tabs.length / 2);
        if (scrollIntoViewIndex < 0) {
          scrollIntoViewIndex = 0;
        }
        this.setData({
          scrollIntoViewId: `scroll-thumb-${scrollIntoViewIndex}`,
        });
      }
    },
    bindThumbTap(e) {
      const { index } = e.target.dataset;
      const { tabs } = this.data;
      if ((tabs[index] as any).disabled) {
        return;
      }
      this.triggerEvent('change', { active: index });
    },
    bindTrackTouchStart(e) {
      const touch = e.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
    },
    bindTrackTouchMove(e) {
      const touch = e.touches[0];
      this.deltaX = touch.clientX - this.startX;
      this.deltaY = touch.clientY - this.startY;
    },
    bindTrackTouchEnd() {
      const {
        data: { swipeableThreshold, tabs, active },
        deltaX,
        deltaY,
      } = this;
      if (
        Math.abs(deltaX) < swipeableThreshold ||
        Math.abs(deltaX / deltaY) < 0.8
      ) {
        return;
      }
      const len = tabs.length;
      let index = active;
      if (deltaX < 0) {
        while (index < len - 1) {
          index++;
          if (!(tabs[index] as any).disabled) {
            break;
          }
        }
      } else if (deltaX > 0) {
        while (index > 0) {
          index--;
          if (!(tabs[index] as any).disabled) {
            break;
          }
        }
      }
      if (index !== active) {
        this.triggerEvent('change', { active: index });
      }
    },
  },
});
