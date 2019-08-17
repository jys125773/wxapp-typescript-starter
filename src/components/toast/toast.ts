interface ToastOptions {
  show?: boolean;
  title?: string | number;
  text?: string | number;
  mask?: boolean;
  maskClosable?: boolean;
  zIndex?: number;
  context?: any;
  position?: string;
  animateDuration?: number;
  duration?: number;
  selector?: string;
  onClose?: () => void;
}

const defaultOptions: ToastOptions = {
  show: true,
  title: '',
  text: '',
  mask: true,
  maskClosable: true,
  zIndex: 1000,
  animateDuration: 100,
  duration: 3000,
  position: 'middle',
  selector: '#toast',
  onClose: () => {},
};

function toast(options: ToastOptions | string) {
  if (typeof options === 'string') {
    options = {
      ...defaultOptions,
      text: options,
    };
  } else {
    options = {
      ...defaultOptions,
      ...options,
    };
  }

  const { onClose, duration, selector } = options;
  const context = options.context || getCurrentPages().pop();
  const toast = context && context.selectComponent(selector);

  if (!toast) {
    console.warn(`未找到id=${selector}的toast组件`);
    return;
  }

  delete options.onClose;
  delete options.context;
  delete options.selector;

  if (toast.timer) {
    clearTimeout(toast.timer);
    toast.timer = null;
  }

  toast.onClose = onClose;
  toast.show(options);

  if (duration && duration > 0) {
    toast.timer = setTimeout(() => {
      toast.hide();
      if (onClose) {
        onClose();
      }
    }, duration);
  }
}

export default toast;
