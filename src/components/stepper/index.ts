//自然数正则
const NATURE_NUM_REG = /^(0|[1-9]\d*)$/;

Component({
  externalClasses: ['custom-class'],
  options: {
    addGlobalClass: true,
  },
  properties: {
    value: {
      type: Number,
      value: 0,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    min: {
      type: Number,
      value: 0,
    },
    max: {
      type: Number,
      value: Infinity,
    },
  },
  inputValue: '',
  methods: {
    bindMinus() {
      const { value: oldValue, min } = this.data;
      const value = oldValue - 1;
      if (value >= min) {
        this.triggerEvent('minus', { value });
      } else {
        this.triggerEvent('overlimit');
      }
    },
    bindPlus() {
      const { value: oldValue, max } = this.data;
      const value = oldValue + 1;
      if (value <= max) {
        this.triggerEvent('plus', { value });
      } else {
        this.triggerEvent('overlimit');
      }
    },
    //input时记录value，以防某些手机input blur取不到值
    bindInput(e) {
      this.inputValue = e.detail.value;
    },
    bindBlur(e) {
      const {
        inputValue,
        data: { min, max, value: oldValue },
      } = this;
      let { value = inputValue } = e.detail;

      if (oldValue === value) {
        return;
      }

      if (!NATURE_NUM_REG.test(value)) {
        this.setData({ value: oldValue });
        return;
      }

      value = Number(value);

      if (value < min || value > max) {
        this.setData({ value: oldValue });
        this.triggerEvent('overlimit');
        return;
      }

      this.triggerEvent('blur', { value });
    },
  },
});
