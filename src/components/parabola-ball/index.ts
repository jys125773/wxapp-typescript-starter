Component({
  data: {
    left: 0,
    top: 0,
    hidden: true,
  },
  timer: 0,
  detached() {
    this.cancel();
  },
  pageLifetimes: {
    hide() {
      this.cancel();
    },
  },
  methods: {
    animate(options: IOptions & { onEnd: () => void }) {
      const { onEnd } = options;
      this.cancel(false);
      this.setData({
        left: options.start.x,
        top: options.start.y,
        hidden: false,
      });
      parabolaAnimate(options, ({ x, y }, timer) => {
        this.setData({ left: x, top: y });
        this.timer = timer;
        if (timer === 0) {
          this.setData({ hidden: true });
          if (typeof onEnd === 'function') {
            onEnd();
          }
        }
      });
    },
    cancel(hidden = true) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = 0;
      }
      if (hidden) {
        this.setData({ hidden: true });
      }
    },
  },
});

interface IOptions {
  start: { x: number; y: number };
  end: { x: number; y: number };
  topY: number;
  gforce?: number;
  frameDuration?: number;
}

function parabolaAnimate(
  options: IOptions,
  callback: (ponit: { x: number; y: number }, timer: number) => void,
) {
  const { start, end, topY, gforce = 2000, frameDuration = 10 } = options;
  const tStartToTop = Math.sqrt((Math.abs(topY - start.y) * 2) / gforce);
  const tTopToEnd = Math.sqrt((Math.abs(topY - end.y) * 2) / gforce);
  const tFrame = frameDuration / 1000;

  let tRest = tStartToTop + tTopToEnd;
  const vx = (end.x - start.x) / (tStartToTop + tTopToEnd);
  let vy = -gforce * tStartToTop;
  let startX = start.x;
  let startY = start.y;

  let timer = setInterval(() => {
    const ponit = {
      x: startX + vx * tFrame,
      y: startY + vy * tFrame + (gforce * tFrame * tFrame) / 2,
    };
    vy = vy + gforce * tFrame;
    tRest = tRest - tFrame;
    startX = ponit.x;
    startY = ponit.y;
    if (tRest <= 0) {
      clearInterval(timer);
      timer = 0;
    }
    callback(ponit, timer);
  }, frameDuration);
}
