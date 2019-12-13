Component({
  data: {
    show: false,
    message: '',
    mask: false,
    maskClosable: false,
    zIndex: 0,
    position: '',
    duration: 0,
    icon: '',
    spinner: '',
    maskColor: '',
  },
  methods: {
    show(options) {
      this.setData({ ...options, show: true });
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
