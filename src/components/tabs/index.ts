import { debounce } from '../../utils/throttle-debounce';

Component({
  externalClasses: [
    'custom-class',
    'line-class',
    'tab-class',
    'tab-active-class',
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
      optionalTypes: [String],
      observer() {
        if (this.data.mounted) {
          this.updateChildren();
        }
      },
    },
    swipeable: Boolean,
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
      value: true,
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
  },
  ready() {
    this.setData({
      mounted: true,
      stickyContainer: () => this.createSelectorQuery().select('.ui-tabs'),
    });
    this.updateChildren();
  },
  methods: {
    updateTabs: debounce(6, function(this: any) {
      this.setData({
        tabs: this.children.map(child => child.data),
        scrollable: this.getScrollable(),
      });
    }),
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
      const {
        dataset: { index },
      } = e.target;
      this.triggerEvent('change', { active: index });
    },
  },
});
