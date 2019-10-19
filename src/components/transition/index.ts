import { isObject, isNumer } from '../../utils/util';

const ENTER_CLASS = 'enter-class';
const ENTER_ACTIVE_CLASS = 'enter-active-class';
const ENTER_TO_CLASS = 'enter-to-class';
const LEAVE_CLASS = 'leave-class';
const LEAVE_ACTIVE_CLASS = 'leave-active-class';
const LEAVE_TO_CLASS = 'leave-to-class';

const STATUS_CLASS_MAP = {
  enter: ENTER_CLASS,
  entering: `${ENTER_CLASS} ${ENTER_ACTIVE_CLASS}`,
  entered: ENTER_TO_CLASS,
  leave: LEAVE_CLASS,
  leaving: `${LEAVE_CLASS} ${LEAVE_ACTIVE_CLASS}`,
  leaved: LEAVE_TO_CLASS,
};

Component({
  externalClasses: [
    ENTER_CLASS,
    ENTER_ACTIVE_CLASS,
    ENTER_TO_CLASS,
    LEAVE_CLASS,
    LEAVE_ACTIVE_CLASS,
    LEAVE_TO_CLASS,
  ],
  properties: {
    in: {
      type: Boolean,
      value: false,
    },
    duration: {
      // type: [Object,Number],
      type: Object,
      value: {
        enter: 300,
        leave: 300,
      },
    },
    enter: {
      type: Boolean,
      value: true,
    },
    leave: {
      type: Boolean,
      value: true,
    },
    mountOnEnter: {
      type: Boolean,
      value: false,
    },
    unmountOnLeave: {
      type: Boolean,
      value: false,
    },
    appear: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    animateStatus: '',
    animateClass: '',
    mounted: false,
  },
  attached() {

  },
  methods: {
    performEnter() {

    },
    performEntered() {

    },
    performLeave() {

    },
    performLeaved() {

    },
    updateStatus() {

    },
    getClassNames() {

    },
    getDurations() {
      const { duration } = this.data;
      if (isObject(duration)) {
        const { enter: _enter, leave: _leave } = duration;
        return {
          enter: isNumer(_enter) ? _enter : 0,
          leave: isNumer(_leave) ? _leave : 0,
        };
      }
      const _duration = isNumer(duration) ? duration : 0;
      return {
        enter: _duration,
        leave: _duration,
      };
    },
    noop() { },
  },
});