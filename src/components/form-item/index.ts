
Component({
  relations: {
    '../form/index': {
      type: 'ancestor',
      linked(target) {
        this.ancestor = target;
      },
      unlinked() {
        this.ancestor = null;
      },
    },
  },
  properties: {
    prop: String,
    rules: {
      type: null,
    },
    label: String,
    showMessage: {
      type: Boolean,
      value: true,
    },
    inlineMessage: Boolean,
    valuePropName: {
      type: String,
      value: 'value',
    },
    trigger: {
      type: null,
      value: 'change',
    },
  },
  data: {},
  methods: {
    validate() {},
    resetField() {},
    clearValidate() {},
  },
});
