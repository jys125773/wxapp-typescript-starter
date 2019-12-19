Component({
  externalClasses: [
    'custom-class',
    'line-class',
    'tab-class',
    'tab-active-class',
  ],
  relations: {
    '../tab/index': {
      type: 'child',
      linked(target) {},
      unlinked(target) {},
    },
  },
});
