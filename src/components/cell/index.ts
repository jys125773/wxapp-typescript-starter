Component({
  options: {
    multipleSlots: true,
  },
  externalClasses: [
    'custom-class',
    'title-class',
    'label-class',
    'value-class',
    'right-icon-class',
    'hover-class',
  ],
  properties: {
    title: {
      type: String,
      value: '',
    },
    value: null,
    icon: String,
    size: String,
    label: String,
    center: Boolean,
    isLink: Boolean,
    required: Boolean,
    clickable: Boolean,
    titleWidth: String,
    customStyle: String,
    arrowDirection: String,
    useLabelSlot: Boolean,
    border: {
      type: Boolean,
      value: true,
    },
    url: String,
    linkType: {
      type: String,
      value: 'navigateTo',
    },
  },
  methods: {
    bindTap(e) {
      const { linkType, url } = this.data;
      this.triggerEvent('click', e.detail);
      if (url && wx[linkType]) {
        wx[linkType]({ url });
      }
    },
  },
});
