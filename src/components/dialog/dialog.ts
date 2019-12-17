import { getCurrentPage } from '../../utils/helper';

interface DialogButton {
  text: String;
  textColor: String;
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

interface DialogOptions {
  title?: String;
  content: String;
  show?: boolean;
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
  selector?: string;
}

function show(options: DialogOptions) {
  const { selector } = options;
  const context = options.context || getCurrentPage();
  const ref = context && context.selectComponent(selector);
  if (!ref) {
    console.warn(`未找到id=${selector}的dialog组件`);
    return;
  }
}

export default {
  show
}