Component({
  data: {},
  ready() {
    this.parabola = this.selectComponent('#parabola');
  },
  methods: {
    dropDown(e) {
      const touch = e.changedTouches[0];
      const { clientX, clientY } = touch;

      this.parabola.animate({
        start: { x: clientX, y: clientY },
        end: { x: 200, y: clientY + 100 },
        topY: clientY - 60,
      });
    },
  },
});
