Component({
  externalClasses: [
    'custom-class',
    'header-class',
    'content-class',
    'footer-class',
  ],
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
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
    duration: {
      type: Object,
      value: { enter: 300, leave: 200 },
    },
    timingFunction: {
      type: String,
      value: 'ease',
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
    title: {
      type: String,
      value: '标题',
    },
    content: {
      type: String,
      value: '文字内文字内文字内文字内文字内',
    },
    verticalButtons: {
      type: Boolean,
      value: false,
    },
    buttons: {
      type: Array,
      value: [
        {
          text: '退出',
        },
        {
          text: '取消',
        },
        {
          text: '确定',
        }
      ],
    },
    closable: {
      type: Boolean,
      value: true,
    },
    popupStyle: {
      type: String,
      value: '',
    },
    useSlot: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    show(options) {
      this.setData({ show: true, ...options });
    },
    hide() {
      this.setData({ show: false });
    }
  },
});