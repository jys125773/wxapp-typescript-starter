import toast from '../../../../components/toast/toast';

Component({
  data: {
    value: 0,
  },
  methods: {
    bindMinus(e) {
      this.setData({ value: e.detail.value });
    },
    bindPlus(e) {
      this.setData({ value: e.detail.value });
    },
    bindBlur(e) {
      this.setData({ value: e.detail.value });
    },
    bindOverlimit() {
      toast({ position: 'top', text: '超出stepper的区间了' });
    },
  },
});
