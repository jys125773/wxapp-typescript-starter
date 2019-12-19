import { isNumer, isObject } from '../../utils/util';

const ENTER_CLASS = 'enter';
const ENTER_ACTIVE_CLASS = 'enter-active';
const ENTER_TO_CLASS = 'enter-to';
const LEAVE_CLASS = 'leave';
const LEAVE_ACTIVE_CLASS = 'leave-active';
const LEAVE_TO_CLASS = 'leave-to';

const ENTERING_STATUS = 1;
const ENTERED_STATUS = 2;
const LEAVEING_STATUS = 3;
const LEAVED_STATUS = 4;

function nextTick(callback) {
  setTimeout(callback, 16);
}

Component({
  externalClasses: ['custom-class'],
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(value) {
        if (this.data.hasAttached) {
          if (value) {
            this.performEnter();
          } else {
            this.performLeave();
          }
        }
      },
    },
    appear: {
      type: Boolean,
      value: false,
    },
    name: {
      type: String,
      value: 'fade',
    },
    type: {
      type: String,
      value: 'transition',
    },
    mode: {
      type: String,
      value: '',
    },
    duration: {
      type: null,
      value: 300,
    },
    customStyle: {
      type: String,
      value: '',
    },
    preventScroll: {
      type: Boolean,
      value: false,
    },
    mountOnEnter: {
      type: Boolean,
      value: true,
    },
    unMountOnLeave: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    status: 0,
    classes: '',
    hidden: false,
    inited: false,
    durationStyle: '',
    hasAttached: false,
  },
  attached() {
    const { show, appear, mountOnEnter } = this.data;
    const inited = show && mountOnEnter;
    if (show && appear) {
      this.setData(
        {
          inited,
          hasAttached: true,
          status: ENTERED_STATUS,
          classes: this.getClasses(LEAVE_TO_CLASS),
        },
        () => {
          nextTick(() => {
            this.performEnter();
          });
        },
      );
    } else {
      this.setData({
        inited,
        hidden: !show,
        hasAttached: true,
        status: show ? ENTERED_STATUS : LEAVED_STATUS,
      });
    }
  },
  methods: {
    performEnter() {
      if (this.data.mode === 'in-out') {
        this.performEntered();
        return;
      }
      this.triggerEvent('before-enter');
      this.setData(
        {
          hidden: false,
          inited: true,
          classes: this.getClasses(ENTER_CLASS, ENTER_ACTIVE_CLASS),
          durationStyle: this.getDurationStyle(ENTERING_STATUS),
          status: ENTERING_STATUS,
        },
        () => {
          nextTick(() => {
            if (this.data.status === ENTERING_STATUS) {
              this.setData({
                hidden: false,
                classes: this.getClasses(ENTER_ACTIVE_CLASS, ENTER_TO_CLASS),
              });
            }
          });
        },
      );
    },
    performEntered() {
      this.triggerEvent('after-enter');
      this.setData({
        hidden: false,
        classes: this.getClasses(ENTER_TO_CLASS),
        durationStyle: '',
        status: ENTERED_STATUS,
      });
    },
    performLeave() {
      if (this.data.mode === 'out-in') {
        this.performLeaved();
        return;
      }
      this.triggerEvent('before-leave');
      this.setData(
        {
          hidden: false,
          inited: true,
          classes: this.getClasses(LEAVE_CLASS, LEAVE_ACTIVE_CLASS),
          durationStyle: this.getDurationStyle(LEAVEING_STATUS),
          status: LEAVEING_STATUS,
        },
        () => {
          nextTick(() => {
            if (this.data.status === LEAVEING_STATUS) {
              this.setData({
                classes: this.getClasses(LEAVE_ACTIVE_CLASS, LEAVE_TO_CLASS),
              });
            }
          });
        },
      );
    },
    performLeaved() {
      const { unMountOnLeave } = this.data;
      this.triggerEvent('after-leave');
      this.setData({
        hidden: true,
        inited: !unMountOnLeave,
        classes: this.getClasses(LEAVE_TO_CLASS),
        durationStyle: '',
        status: LEAVED_STATUS,
      });
    },
    onAnimationEnd() {
      switch (this.data.status) {
        case ENTERING_STATUS:
          this.performEntered();
          break;
        case LEAVEING_STATUS:
          this.performLeaved();
          break;
        default:
          break;
      }
    },
    binAnimationEnd() {
      if (this.data.type === 'animation') {
        this.onAnimationEnd();
      }
    },
    binTransitionEnd() {
      if (this.data.type === 'transition') {
        this.onAnimationEnd();
      }
    },
    getClasses(...args) {
      return args.map(arg => this.data.name + '-' + arg).join(' ');
    },
    getDurationStyle(status) {
      const { duration, type } = this.data;
      if (!duration) return '';
      let current = -1;
      if (isNumer(duration)) {
        current = duration;
      } else if (isObject(duration)) {
        const { enter, leave } = duration;
        if (status === 1 && isNumer(enter)) {
          current = enter;
        } else if (status === LEAVEING_STATUS && isNumer(leave)) {
          current = leave;
        }
      }
      if (current < 0) return '';
      return `${type}-duration:${current}ms;-webkit-${type}-duration:${current}ms;`;
    },
    noop() {},
  },
});
