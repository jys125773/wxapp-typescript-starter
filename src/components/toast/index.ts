import { defaultToastOptions } from './toast';

Component({
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    message: {
      type: String,
      value: defaultToastOptions.message,
    },
    mask: {
      type: Boolean,
      value: defaultToastOptions.mask,
    },
    maskClosable: {
      type: Boolean,
      value: defaultToastOptions.maskClosable,
    },
    zIndex: {
      type: Number,
      value: defaultToastOptions.zIndex,
    },
    position: {
      type: String,
      value: defaultToastOptions.position,
    },
    duration: {
      type: null,
      value: defaultToastOptions.duration,
    },
    icon: {
      type: String,
      value: defaultToastOptions.icon,
    },
    spinner: {
      type: String,
      value: defaultToastOptions.spinner,
    },
    maskColor: {
      type: String,
      value: defaultToastOptions.maskColor,
    },
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
