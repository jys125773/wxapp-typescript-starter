Component({
  externalClasses: [
    'custom-class',
    'valid-class',
    'invalid-class',
    'pristine-class',
    'dirty-class',
    'label-class',
    'message-class',
  ],
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
      observer() {
        if (this.ancestor) {
          this.ancestor.updateValidator();
        }
      },
    },
    label: String,
    showLabel: {
      type: Boolean,
      value: false,
    },
    showMessage: {
      type: Boolean,
      value: true,
    },
    valuePropName: {
      type: String,
      value: 'value',
    },
    trigger: {
      type: null,
      value: 'change',
    },
  },
  data: {
    dirty: false,
    pristine: true,
    errMessage: '',
  },
  methods: {
    setValidate(errMessage) {
      this.setData({ errMessage });
    },
    clearValidate() {
      this.setData({ errMessage: '' });
    },
    setDirty() {
      const { dirty } = this.data;
      if (!dirty) {
        this.setData({
          dirty: true,
          pristine: false,
        });
      }
    },
    resetField() {
      this.setData({
        dirty: false,
        pristine: true,
        errMessage: '',
      });
    },
  },
});
