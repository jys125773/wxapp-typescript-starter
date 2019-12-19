import { rpx2px } from '../../utils/helper';

Component({
  externalClasses: ['custom-class', 'star-class'],
  properties: {
    value: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: 5,
    },
    fontSize: {
      type: Number,
      value: 50,
    },
    margin: {
      type: Number,
      value: 10,
    },
    activeColor: {
      type: String,
      value: '#ffc900',
    },
    inactiveColor: {
      type: String,
      value: '#ccc',
    },
    disabledColor: {
      type: String,
      value: '#ccc',
    },
    activeIcon: {
      type: String,
      value: 'star-f',
    },
    inactiveIcon: {
      type: String,
      value: 'star-o',
    },
    halfIcon: {
      type: String,
      value: 'star-half',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    allowHalf: {
      type: Boolean,
      value: true,
    },
    touchable: {
      type: Boolean,
      value: true,
    },
  },
  methods: {
    onTouch(e: any) {
      const { max, allowHalf, margin: _margin, value: _value } = this.data;
      const touch = e.touches[0];
      const margin = rpx2px(_margin);
      const selQuery = this.createSelectorQuery();
      selQuery
        .select('.ui-rate')
        .boundingClientRect((rect: any) => {
          const { width, left } = rect;
          const starWidth = (width - (max - 1) * margin) / max;
          const offsetX = touch.pageX - left;
          const num = (offsetX + margin) / (starWidth + margin);
          const remainder = num % 1;
          const integral = num - remainder;
          const value =
            remainder <= 0.5 && allowHalf ? integral + 0.5 : integral + 1;
          if (value !== _value) {
            this.triggerEvent('change', { value });
          }
        })
        .exec();
    },
  },
});
