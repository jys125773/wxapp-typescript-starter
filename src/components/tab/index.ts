Component({
  relations: {
    '../tabs/index': {
      type: 'parent',
    },
  },
  properties: {
    title: String,
    disabled: Boolean,
  },
  data: {
    inited: false,
    width: 0,
  },
  methods: {
    update(data: { width?: number; inited?: boolean }) {
      const { width, inited } = this.data;
      if (data.width !== width || data.inited !== inited) {
        this.setData(data);
      }
    },
  },
});
