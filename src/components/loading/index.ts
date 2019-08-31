Component({
  externalClasses: ['custom-class'],
  properties: {
    size: {
      type: String,
      value: '50rpx',
    },
    // circle|fading-circle|double-bounce|three-bounce|pulse|wave|line
    type: {
      type: String,
      value: 'line',
    },
    color: {
      type: String,
      value: '#333',
    },
    // type = line 时生效
    lineWidth: {
      type: String,
      value: '2rpx',
    },
  },
});
