Page({
  data: {
    formData: {},
    formRules: {
      name: [{ required: true }, { pattern: 'abc' }],
      age: [{ required: true }, { range: [5, 40] }],
      address: [{ required: true }],
    },
  },
  onReady() {
    this.$form = this.selectComponent('#ui-form');
    this.$form.create({
      // name: [{ enum: ['a', 'b'] }],
      // age: { type: 'number' },
      // address: {
      //   type: 'array',
      //   fields: {
      //     0: { range: [1, 10] },
      //   },
      // },
    });
  },
  onFeildChange(e) {
    this.$form.onFeildChange(e);
  },
});
