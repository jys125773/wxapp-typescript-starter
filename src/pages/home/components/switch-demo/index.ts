Component({
  data: {
    checked: false,
  },
  methods: {
    bindChange(e) {
      this.setData({
        checked: e.detail.checked,
      });
    },
  },
});
