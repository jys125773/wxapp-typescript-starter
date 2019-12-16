Component({
  externalClasses: ['custom-class', 'node-class'],
  properties: {
    checked: Boolean,
    loading: Boolean,
    disabled: Boolean,
    activeColor: {
      type: String,
      value: '#07c160',
    },
    inactiveColor: {
      type: String,
      value: '#fff',
    },
    loadingColor: {
      type: String,
      value: '#ccc',
    },
    size: {
      type: String,
      value: '50rpx',
    },
  },
  methods: {
    bindTap() {
      const { checked, disabled } = this.data;
      if (!disabled) {
        this.triggerEvent('change', { checked: !checked });
      }
    },
  },
});
