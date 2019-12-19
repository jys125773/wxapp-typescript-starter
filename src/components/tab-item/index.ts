Component({
  relations: {
    '../tabs/index': {
      type: 'parent',
      linked(target) {
        this.parent = target;
      },
      unlinked() {
        this.parent = null;
      },
    },
  },
  properties: {
    dot: Boolean,
    info: null,
    title: String,
    disabled: Boolean,
    titleStyle: String,
    name: {
      type: String,
      optionalTypes: [Number],
      value: '',
    },
  },
  data: {
    active: false,
  },
  methods: {
    update(active) {
      this.setData({ active });
    },
  },
});
