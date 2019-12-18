import { getCurrentPage } from '../../utils/helper';

interface DialogButton {
  text: String;
  textColor: String;
  hold?: boolean;
  async?: boolean;
  class?: String;
  hoverclass?: String;
  disabled?: boolean;
  loading?: boolean;
  formType?: String;
  openType?: String;
  hoverStopPropagation?: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
  lang?: String;
  sessionFrom?: String;
  sendMessageTitle?: String;
  sendMessagePath?: String;
  sendMessageImg?: String;
  appParameter?: String;
  showMessageCard?: boolean;
  onGetUserInfo?: Function;
  onContact?: Function;
  onGetPhoneNumber?: Function;
  onOpenSetting?: Function;
  onLaunchApp?: Function;
  onTap?: Function;
}

interface DialogShowOptions {
  title?: String;
  content: String;
  transition?: string;
  zIndex?: number;
  duration?: number | { enter: number; leave: number };
  timingFunction?: String;
  mask?: boolean;
  maskClosable?: boolean;
  maskColor?: String;
  destroyOnClose?: boolean;
  preventScroll?: boolean;
  verticalButtons?: boolean;
  closable?: boolean;
  popupStyle?: String;
  buttons: DialogButton[];
  context?: any;
  selector: string;
}

interface DialogAlertOptions {
  title?: String;
  content: String;
  confirmText?: String;
  confirmTextColor?: String;
  confirmAsync?: boolean;
  onConfirm: Function;
  context?: any;
  selector: string;
}

interface DialogComfirmOptions extends DialogAlertOptions {
  cancelText?: String;
  cancelTextColor?: String;
  cancelAsync?: boolean;
  onCancel?: String;
}

export const defaultDialogOptions = {
  title: '',
  content: '',
  transition: 'scale',
  zIndex: 100,
  duration: { enter: 100, leave: 100 },
  timingFunction: 'ease',
  mask: true,
  maskClosable: true,
  maskColor: 'rgba(0,0,0,0.5)',
  destroyOnClose: true,
  preventScroll: true,
  verticalButtons: false,
  closable: false,
  popupStyle: '',
  buttons: [],
};

function getInstance(selector: string = '#custom-dialog', context?: any) {
  const ctx = context || getCurrentPage();
  const instance = ctx && ctx.selectComponent(selector);
  if (!instance) {
    console.warn(`未找到id=${selector}的dialog组件`);
  }
  return instance;
}

function show(options: DialogShowOptions) {
  const { context, selector, ...rest } = options;
  const instance = getInstance(selector, context);
  if (instance) {
    instance.show({ ...defaultDialogOptions, ...rest });
  }
  return instance;
}

function alert(options: DialogAlertOptions) {
  const {
    context,
    selector,
    title,
    content,
    confirmText = '确定',
    confirmTextColor = '#1989fa',
    confirmAsync,
    onConfirm,
  } = options;
  const instance = getInstance(selector, context);
  if (instance) {
    instance.show({
      ...defaultDialogOptions,
      title,
      content,
      buttons: [
        {
          text: confirmText,
          textColor: confirmTextColor,
          async: confirmAsync,
          onTap: onConfirm,
        },
      ],
    });
  }
  return instance;
}

function confirm(options: DialogComfirmOptions) {
  const {
    context,
    selector,
    title,
    content,
    confirmText = '确定',
    confirmTextColor = '#1989fa',
    confirmAsync,
    onConfirm,
    cancelText = '取消',
    cancelTextColor = '',
    cancelAsync,
    onCancel,
  } = options;
  const instance = getInstance(selector, context);
  if (instance) {
    instance.show({
      ...defaultDialogOptions,
      title,
      content,
      buttons: [
        {
          text: cancelText,
          textColor: cancelTextColor,
          async: cancelAsync,
          onTap: onCancel,
        },
        {
          text: confirmText,
          textColor: confirmTextColor,
          async: confirmAsync,
          onTap: onConfirm,
        },
      ],
    });
  }
  return instance;
}

export default {
  show,
  confirm,
  alert,
}