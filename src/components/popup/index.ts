Component({
  externalClasses: ['custom-class', 'mask-class'],
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(show) {
        if (show) {
          this.enter();
        } else {
          this.leave();
        }
      },
    },
    fixed: {
      type: Boolean,
      value: true,
    },
    transition: {
      type: String,
      value: '',
    },
    zIndex: {
      type: Number,
      value: 10,
    },
    position: {
      type: String,
      value: 'center',
    },
    duration: {
      type: Object,
      value: { enter: 300, leave: 200 },
    },
    timingFunction: {
      type: String,
      value: 'cubic-bezier(.17,.67,.22,.9)',
    },
    mask: {
      type: Boolean,
      value: true,
    },
    maskClosable: {
      type: Boolean,
      value: true,
    },
    maskColor: {
      type: String,
      value: 'rgba(0,0,0,0.5)',
    },
    destroyOnClose: {
      type: Boolean,
      value: false,
    },
    preventScroll: {
      type: Boolean,
      value: true,
    },
    maskStyle: String,
    contentStyle: String,
    safeAreaInsetBottom: {
      type: Boolean,
      value: true,
    },
    safeAreaInsetTop: {
      type: Boolean,
      value: false,
    },
    safeTabbar: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    inited: false,
    hidden: true,
    animationStyle: {
      mask: '',
      content: '',
    },
  },
  ready() {
    this.mounted = true;
  },
  methods: {
    enter() {
      this.setData({
        animationStyle: this.getAnimationStyle(true),
        inited: true,
        hidden: false,
      });
    },
    leave() {
      this.setData({
        animationStyle: this.getAnimationStyle(false),
      });
    },
    getAnimationStyle(show: boolean) {
      const { position, transition, timingFunction } = this.data;
      let { duration } = this.data;
      if (!this.mounted) {
        duration = 0;
      }
      const config = `${show ? 'enter' : 'leave'} ${
        duration.enter ? (show ? duration.enter : duration.leave) : duration
      }ms ${timingFunction} both`;
      const maskAnimationStyle = `fade-${config}`;
      const contentAnimationStyle = `${transition ||
        (position === 'center' ? 'fade' : 'slide-' + position)}-${config}`;
      return {
        mask: `animation:${maskAnimationStyle};-webkit-animation:${maskAnimationStyle};`,
        content: `animation:${contentAnimationStyle};-webkit-animation:${contentAnimationStyle};`,
      };
    },
    bindTapMask(e) {
      const { maskClosable } = this.data;
      if (maskClosable) {
        this.triggerEvent('close', e.detail);
      }
    },
    bindAnimationend() {
      const { show, destroyOnClose } = this.data;
      if (show) {
        this.triggerEvent('afterOpen');
      } else {
        this.setData({ hidden: true, inited: !destroyOnClose });
        this.triggerEvent('afterClose');
      }
    },
    noop() {},
  },
});
