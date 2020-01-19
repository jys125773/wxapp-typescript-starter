Component({
  relations: {
    '../tabs/index': {
      type: 'parent',
      linked(target) {
        if (!this.data.inited && !target.data.lazy) {
          this.setData({ inited: true });
        }
      },
    },
  },
  properties: {
    title: String,
    disabled: Boolean,
    titleStyle: String,
  },
  data: {
    active: false,
    inited: false,
  },
  methods: {
    update(active) {
      const inited = this.data.inited || active;
      this.setData({ active, inited });
    },
  },
});
