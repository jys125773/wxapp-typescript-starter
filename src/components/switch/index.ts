Component({
  externalClasses: ['custom-class', 'node-class'],
  properties: {
    checked: Boolean,
    loading: Boolean,
    disabled: Boolean,
    activeColor: String,
    inactiveColor: String,
    size: {
      type: String,
      value: '50rpx',
    },
  },
  methods: {
    bindTap() {
      const { checked } = this.data;
      this.triggerEvent('change', { checked: !checked });
    },
  },
});
