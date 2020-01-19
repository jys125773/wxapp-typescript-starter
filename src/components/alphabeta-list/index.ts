import { debounce, throttle } from 'throttle-debounce';

const ANCHOR_RELATION_KEY = '../alphabeta-anchor/index';
const SLIDE_BAR_CLASS = '.ui-alphabeta-list__slidebar';
const ANCHOR_CLASS = '.ui-alphabeta-anchor';

Component({
  externalClasses: ['custom-class', 'slidebar-class', 'toast-class'],
  relations: {
    [ANCHOR_RELATION_KEY]: {
      type: 'descendant',
      linked() {
        this.setAlphabetaList();
      },
      linkChanged() {
        this.setAlphabetaList();
      },
      unlinked() {
        this.setAlphabetaList();
      },
    },
  },
  properties: {
    highlightColor: {
      type: String,
      value: '#07c160',
    },
    sticky: {
      type: Boolean,
      value: true,
    },
    stickyOffsetTop: {
      type: Number,
      value: 0,
    },
    zIndex: {
      type: Number,
      value: 1,
    },
    toast: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    alphabetaList: [],
    scrollTop: 0,
    scrollWithAnimation: false,
    active: 0,
    toastHidden: true,
  },
  methods: {
    setAlphabetaList: debounce(10, function(this: any) {
      this.anchors = this.getRelationNodes(ANCHOR_RELATION_KEY);
      const alphabetaList = this.anchors.map(({ data }) => data);
      this.setData({ alphabetaList }, () => {
        this.getRect();
      });
    }),
    getRect() {
      this.createSelectorQuery()
        .select(SLIDE_BAR_CLASS)
        .boundingClientRect(rect => {
          this.slidebarRect = rect;
        })
        .exec();
      this.anchors.forEach(anchor => {
        anchor
          .createSelectorQuery()
          .select(ANCHOR_CLASS)
          .boundingClientRect(rect => {
            Object.assign(anchor, {
              height: rect.height,
              top: rect.top + this.data.scrollTop,
            });
          })
          .exec();
      });
    },
    scrollTo(index: number, scrollWithAnimation = false, callback?: Function) {
      const {
        active,
        scrollWithAnimation: prevScrollWithAnimation,
      } = this.data;
      const anchor = this.anchors[index];
      if (anchor && active !== index) {
        const { top } = anchor;
        const updates = { scrollTop: top, active: index };
        const finalCallback = () => callback && callback();
        if (scrollWithAnimation !== prevScrollWithAnimation) {
          this.setData({ scrollWithAnimation }, () => {
            this.setData(updates, finalCallback);
          });
        } else {
          this.setData(updates, finalCallback);
        }
        wx.vibrateShort();
      }
    },
    bindScroll: throttle(40, function(this: any, e: any) {
      const { anchors, slideBarTouching } = this;
      const { scrollTop } = e.detail;
      const {
        highlightColor,
        stickyOffsetTop,
        sticky,
        zIndex,
        active: preActive,
      } = this.data;
      let active = this.getIndexByScrollTop(scrollTop);
      active = this.parseIndex(active);
      if (active !== preActive && !slideBarTouching) {
        this.setData({ active });
      }
      if (!sticky) return;

      const activeAnchor = anchors[active];
      const isActiveAnchorSticky =
        activeAnchor.top <= stickyOffsetTop + scrollTop;

      anchors.forEach((anchor, index) => {
        let anchorStyle = '';
        if (index === active) {
          anchorStyle = `color: ${highlightColor};`;
          if (isActiveAnchorSticky) {
            anchorStyle += `position:fixed;z-index:${zIndex};top:${stickyOffsetTop}px;`;
          }
        } else if (index === active - 1) {
          const translateY = activeAnchor.top - anchor.top - anchor.height;
          anchorStyle = `position:relative;z-index:${zIndex};transform:translate3d(0, ${translateY}px, 0);color:${highlightColor};`;
        } else {
          anchorStyle = '';
        }
        anchor.setStyle(anchorStyle);
      });
    }),
    bindSlideBarItemTap(e) {
      const { index } = e.target.dataset;
      this.scrollTo(index, true, () => {
        this.showToast();
      });
    },
    bindSlideBarTouchStart() {
      this.slideBarTouching = true;
    },
    bindSlideBarTouchEnd() {
      this.slideBarTouching = false;
    },
    bindSlideBarTouchMove: throttle(80, function(this: any, e: any) {
      const touch = e.touches[0];
      const { anchors, slidebarRect } = this;
      const anchorCount = anchors.length;
      const { top, height } = slidebarRect;
      const itemHeight = height / anchorCount;
      let index = Math.floor((touch.clientY - top) / itemHeight);
      index = this.parseIndex(index);
      this.scrollTo(index);
      this.showToast();
    }),
    showToast: throttle(100, function(this: any) {
      const { toast, toastHidden } = this.data;
      if (!toast) return;
      if (toastHidden) this.setData({ toastHidden: false });
      if (this.hideToastTimerId) clearTimeout(this.hideToastTimerId);
      this.hideToastTimerId = setTimeout(() => {
        this.setData({ toastHidden: true });
      }, 600);
    }),
    parseIndex(index: number) {
      const anchorCount = this.anchors.length;
      if (index < 0) return 0;
      if (index >= anchorCount) return anchorCount - 1;
      return index;
    },
    getIndexByScrollTop(scrollTop: number) {
      const {
        anchors,
        data: { stickyOffsetTop, sticky },
      } = this;
      const anchorCount = anchors.length;
      let index = anchorCount;
      while (--index >= 0) {
        const preAnchorHeight =
          index > 0 ? anchors[index - 1].height + stickyOffsetTop : 0;
        if (scrollTop + (sticky ? preAnchorHeight : 0) >= anchors[index].top) {
          return index;
        }
      }
      return -1;
    },
  },
});
