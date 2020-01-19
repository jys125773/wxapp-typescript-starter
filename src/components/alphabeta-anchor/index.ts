Component({
  externalClasses: ['custom-class'],
  relations: {
    '../alphabeta-list/index': {
      type: 'ancestor',
    },
  },
  properties: {
    alphabeta: {
      type: String,
      value: '',
    },
    height: {
      type: String,
      value: '60rpx',
    },
    useSlot: Boolean,
  },
  data: {
    stickyStyle: '',
  },
  methods: {
    setStyle(style: string) {
      if (this.data.stickyStyle !== style) {
        this.setData({ stickyStyle: style });
      }
    },
  },
});
