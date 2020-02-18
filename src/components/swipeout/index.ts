
Component({
  options: {
    multipleSlots: true,
  },
  externalClasses: ['custom-class'],
  properties: {
    disabled: {
      type: Boolean,
      value: false,
    },
    operateWidth: {
      type: Number,
      value: 80,
    },
    threshold: {
      type: Number,
      value: 0.3,
    },
    duration: {
      type: Number,
      value: 300,
    },
    expanded: {
      type: Boolean,
      value: false,
    },
  },
});

