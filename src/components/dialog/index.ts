import { isFunction } from '../../utils/util';
import { defaultDialogOptions } from './dialog';

Component({
  externalClasses: [
    'custom-class',
    'header-class',
    'content-class',
    'footer-class',
  ],
  options: {
    addGlobalClass: true,
  },
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    transition: {
      type: String,
      value: defaultDialogOptions.transition,
    },
    zIndex: {
      type: Number,
      value: defaultDialogOptions.zIndex,
    },
    duration: {
      type: Object,
      value: defaultDialogOptions.duration,
    },
    timingFunction: {
      type: String,
      value: defaultDialogOptions.timingFunction,
    },
    mask: {
      type: Boolean,
      value: defaultDialogOptions.mask,
    },
    maskClosable: {
      type: Boolean,
      value: defaultDialogOptions.maskClosable,
    },
    maskColor: {
      type: String,
      value: defaultDialogOptions.maskColor,
    },
    destroyOnClose: {
      type: Boolean,
      value: defaultDialogOptions.destroyOnClose,
    },
    preventScroll: {
      type: Boolean,
      value: defaultDialogOptions.preventScroll,
    },
    title: {
      type: String,
      value: defaultDialogOptions.title,
    },
    content: {
      type: String,
      value: defaultDialogOptions.content,
    },
    verticalButtons: {
      type: Boolean,
      value: defaultDialogOptions.verticalButtons,
    },
    buttons: {
      type: Array,
      value: defaultDialogOptions.buttons,
    },
    closable: {
      type: Boolean,
      value: defaultDialogOptions.closable,
    },
    popupStyle: {
      type: String,
      value: defaultDialogOptions.popupStyle,
    },
    useSlot: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    show(options) {
      this.setData({ show: true, ...options });
    },
    hide() {
      this.setData({ show: false });
    },
    bindgetuserinfo(e) {
      this.performEvent(e, 'getuserinfo', 'onGetUserInfo');
    },
    bindcontact(e) {
      this.performEvent(e, 'contact', 'onContact');
    },
    bindgetphonenumber(e) {
      this.performEvent(e, 'getphonenumber', 'onGetPhoneNumber');
    },
    binderror(e) {
      this.performEvent(e, 'error', 'onError');
    },
    bindopensetting(e) {
      this.performEvent(e, 'opensetting', 'onOpenSetting');
    },
    bindtap(e) {
      this.performEvent(e, 'tap', 'onTap');
    },
    performEvent(e: any, eventName: string, callbackName: string) {
      const { index } = e.target.dataset;
      const { buttons } = this.data;
      const button = buttons[index];
      this.triggerEvent(eventName, e.detail);
      if (button) {
        const { hold, async } = button;
        const callback = button[callbackName];
        if (isFunction(callback)) {
          const callbackOpts = {
            index,
            event: e,
            hide: () => this.hide(),
            stopLoading: () => { },
          };
          if (async) {
            callbackOpts.stopLoading = () =>
              this.setData({ [`buttons[${index}].loading`]: false });
            this.setData({ [`buttons[${index}].loading`]: true });
          }
          callback(callbackOpts);
          if (!hold && !async) {
            this.hide();
          }
        }
      }
    }
  },
});