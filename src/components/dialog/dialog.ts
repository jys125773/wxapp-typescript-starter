import { getCurrentPage } from '../../utils/helper';

interface DialogButton {
  text: string;
  textColor: string;
  hold?: boolean;
  async?: boolean;
  class?: string;
  hoverclass?: string;
  disabled?: boolean;
  loading?: boolean;
  formType?: string;
  openType?: string;
  hoverStopPropagation?: boolean;
  hoverStartTime?: number;
  hoverStayTime?: number;
  lang?: string;
  sessionFrom?: string;
  sendMessageTitle?: string;
  sendMessagePath?: string;
  sendMessageImg?: string;
  appParameter?: string;
  showMessageCard?: boolean;
  onGetUserInfo?: Function;
  onContact?: Function;
  onGetPhoneNumber?: Function;
  onOpenSetting?: Function;
  onLaunchApp?: Function;
  onTap?: Function;
}

interface DialogShowOptions {
  title?: string;
  content: string;
  transition?: string;
  zIndex?: number;
  duration?: number | { enter: number; leave: number };
  timingFunction?: string;
  mask?: boolean;
  maskClosable?: boolean;
  maskColor?: string;
  destroyOnClose?: boolean;
  preventScroll?: boolean;
  verticalButtons?: boolean;
  closable?: boolean;
  popupStyle?: string;
  buttons: DialogButton[];
  context?: any;
  selector: string;
}

interface DialogAlertOptions {
  title?: string;
  content: string;
  confirmText?: string;
  confirmTextColor?: string;
  confirmAsync?: boolean;
  onConfirm: Function;
  context?: any;
  selector: string;
}

interface DialogComfirmOptions extends DialogAlertOptions {
  cancelText?: string;
  cancelTextColor?: string;
  cancelAsync?: boolean;
  onCancel?: string;
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

function getInstance(selector = '#custom-dialog', context?: any) {
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
};
