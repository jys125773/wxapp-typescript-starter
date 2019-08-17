Component({
  data: {
    show: false,
    title: '',
    text: '',
    mask: false,
    maskClosable: false,
    zIndex: 0,
    position: '',
    animateDuration: 0,
  },
  methods: {
    show(options) {
      this.setData({
        ...options,
        show: true,
      });
    },
    hide() {
      this.setData({ show: false });
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.onClose) {
        this.onClose();
      }
    },
  },
});
