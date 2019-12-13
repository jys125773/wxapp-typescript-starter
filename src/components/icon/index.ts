Component({
  externalClasses: ['custom-class'],
  properties: {
    name: String,
    color: {
      type: String,
      value: '#333',
    },
    size: {
      type: String,
      value: '20rpx',
    },
    customStyle: String,
  },
  methods: {
    bindTap(e) {
      this.triggerEvent('click', e);
    },
  },
});