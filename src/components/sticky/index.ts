import { isFunction } from '../../utils/util';
const CONTAINER_CLASS = '.ui-sticky';

Component({
  externalClasses: ['custom-class'],
  properties: {
    zIndex: {
      type: Number,
      value: 100,
    },
    offsetTop: {
      type: Number,
      value: 0,
      observer() {
        if (this.mounted) {
          this.observeContent();
        }
      },
    },
    disabled: {
      type: Boolean,
      observer(value) {
        if (this.mounted) {
          //@ts-ignore
          value ? this.disconnectObserver() : this.connectObserver();
        }
      },
    },
    container: {
      type: null,
      observer(value) {
        if (this.mounted && isFunction(value) && this.contentObserver) {
          this.observeContainer();
        }
      },
    },
  },
  data: {
    fixed: false,
    containerStyle: '',
    contentStyle: '',
  },
  ready() {
    if (!this.data.disabled) {
      this.connectObserver();
    }
    this.mounted = true;
  },
  detached() {
    //@ts-ignore
    this.disconnectObserver();
  },
  methods: {
    observeContent() {
      const { offsetTop } = this.data;
      const contentObserver = this.createIntersectionObserver({
        thresholds: [0, 1],
      });
      this.disconnectObserver('contentObserver');
      this.contentObserver = contentObserver;
      contentObserver.relativeToViewport({ top: -offsetTop });
      contentObserver.observe(CONTAINER_CLASS, res => {
        this.setFixed(res.boundingClientRect.top);
      });
    },
    observeContainer() {
      const { container } = this.data;
      if (isFunction(container)) {
        const containerRef = container();
        if (containerRef) {
          containerRef
            .boundingClientRect(rect => {
              this.containerHeight = rect.height;
              const containerObserver = this.createIntersectionObserver({
                thresholds: [0, 1],
              });
              this.disconnectObserver('containerObserver');
              this.containerObserver = containerObserver;
              containerObserver.relativeToViewport({
                top: this.containerHeight - this.contentHeight,
              });
              containerObserver.observe(CONTAINER_CLASS, res => {
                this.setFixed(res.boundingClientRect.top);
              });
            })
            .exec();
        }
      }
    },
    connectObserver() {
      const selQuery = this.createSelectorQuery();
      selQuery
        .select(CONTAINER_CLASS)
        .boundingClientRect(rect => {
          this.contentHeight = rect.height;
          this.observeContent();
          this.observeContainer();
        })
        .exec();
    },
    disconnectObserver(observerName) {
      if (observerName) {
        const observer = this[observerName];
        if (observer) {
          observer.disconnect();
          this[observerName] = null;
        }
      } else {
        if (this.containerObserver) {
          this.containerObserver.disconnect();
          this.containerObserver = null;
        }
        if (this.contentObserver) {
          this.contentObserver.disconnect();
          this.contentObserver = null;
        }
      }
    },
    setFixed(top) {
      const { offsetTop, zIndex, disabled } = this.data;
      const { containerHeight, contentHeight } = this;
      if (disabled) return;
      const fixed =
        containerHeight && contentHeight
          ? top > contentHeight - containerHeight && top < offsetTop
          : top < offsetTop;
      if (fixed !== this.data.fixed) {
        this.setData({
          fixed,
          containerStyle: fixed
            ? `height:${contentHeight}px;z-index:${zIndex};`
            : '',
          contentStyle: fixed ? `position:fixed;top:${offsetTop}px` : '',
        });
      }
    },
  },
});
