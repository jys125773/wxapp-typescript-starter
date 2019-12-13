import { getSystemInfo } from '../../utils/helper';

Page({
  animate(e) {
    const { pageX, pageY } = e.touches[0];
    const { windowHeight, windowWidth } = getSystemInfo();
    const parabola = this.selectComponent('#ui-parabola');
    if (parabola) {
      parabola.animate({
        start: { x: pageX, y: pageY },
        end: { x: windowWidth / 2, y: windowHeight },
        topY: pageY - 60,
        gforce: 3000,
        frameInterval: 20,
      })
    }
  }
})