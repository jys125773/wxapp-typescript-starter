import { getCurrentPage } from '../../utils/helper';

interface ToastOptions {
  show?: boolean;
  message?: string | number;
  mask?: boolean;
  maskClosable?: boolean;
  zIndex?: number;
  context?: any;
  position?: string;
  duration?: number | { enter: number; leave: number };
  stayTime?: number;
  selector?: string;
  icon?: String;
  spinner?: String;
  maskColor?: String;
  onClose?: () => void;
}
const defaultOptions: ToastOptions = {
  show: true,
  message: '',
  mask: true,
  maskClosable: true,
  zIndex: 1000,
  duration: { enter: 60, leave: 100 },
  stayTime: 2000,
  position: 'middle',
  selector: '#custom-toast',
  icon: '',
  spinner: '',
  maskColor: '',
  onClose: () => { },
};
function toast(options: ToastOptions | string) {
  if (typeof options === 'string') {
    options = {
      ...defaultOptions,
      message: options,
    };
  } else {
    options = {
      ...defaultOptions,
      ...options,
    };
  }
  const { onClose, stayTime, selector } = options;
  const context = options.context || getCurrentPage();
  const ref = context && context.selectComponent(selector);
  if (!ref) {
    console.warn(`未找到id=${selector}的toast组件`);
    return;
  }
  delete options.onClose;
  delete options.context;
  delete options.selector;
  if (ref.timer) {
    clearTimeout(ref.timer);
    ref.timer = null;
  }
  ref.onClose = onClose;
  ref.show(options);
  if (stayTime && stayTime > 0) {
    ref.timer = setTimeout(() => {
      ref.hide();
      if (onClose) {
        onClose();
      }
    }, stayTime);
  }
  return ref;
}

export default toast;