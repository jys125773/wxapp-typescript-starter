import toast from '../../components/toast/toast';

Page({
  textToast() {
    toast('文字提示');
  },
  longTextToast() {
    toast({
      message:
        '这是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文字',
      position: 'top',
      duration: {
        enter: 200,
        leave: 1000,
      },
    });
  },
  successToast() {
    toast({
      message: '成功提示',
      icon: 'success',
      duration: {
        enter: 200,
        leave: 100,
      },
    });
  },
  failToast() {
    toast({
      message: '失败提示',
      icon: 'fail',
      duration: {
        enter: 200,
        leave: 100,
      },
    });
  },
  loadToast() {
    toast({
      message: '加载中...',
      stayTime: 4000,
      spinner: 'line',
      maskColor: 'rgba(0,0,0,0.5)',
      duration: {
        enter: 200,
        leave: 400,
      },
    });
  },
  asyncToast() {
    let rest = 3;
    const toastRef = toast({
      message: '3秒后关闭',
      stayTime: 0,
      maskClosable: false,
      spinner: 'double-bounce',
    });
    const timer = setInterval(() => {
      if (rest === 0) {
        clearTimeout(timer);
        toastRef.hide();
      } else {
        toast({
          message: `${--rest}秒后关闭`,
          stayTime: 0,
          spinner: 'double-bounce',
          maskClosable: false,
        });
      }
    }, 1000);
  },
});
