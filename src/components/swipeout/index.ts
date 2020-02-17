
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
    slideDistance: {
      type: Number,
      value: 180,
    },
    threshold: {
      type: Number,
      value: 0.3,
    },
    duration: {
      type: Number,
      value: 300,
    },
    open: {
      type: Boolean,
      value: false,
      observer() {
      },
    },
  },
  data: {
   
  },
  methods: {
   
  }
});