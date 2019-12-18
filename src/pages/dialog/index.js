import Dialog from '../../components/dialog/dialog';

Page({
  comfirm() {
    Dialog.confirm({
      title: '请问需要反馈什么问题？',
      content: '你也可以在个人中心的反馈帮助中心里找到这个功能',
      onConfirm: () => {

      },
      onCancel: () => {

      },
    });
  },
  aysncComfirm() {
    Dialog.confirm({
      title: '请问需要反馈什么问题？',
      content: '你也可以在个人中心的反馈帮助中心里找到这个功能',
      confirmAsync: true,
      onConfirm: ({ stopLoading, hide }) => {
        setTimeout(() => {
          stopLoading();
          hide();
        }, 2000);
      },
      onCancel: () => {

      },
    });
  },
  closeIconComfirm() {
    Dialog.show({
      title: '请问需要反馈什么问题？',
      content: '你也可以在个人中心的反馈帮助中心里找到这个功能',
      verticalButtons: true,
      closable: true,
      buttons: [
        {
          text: '没啥事',
          onTap: () => { },
        },
      ],
    });
  },
  alert() {
    Dialog.alert({
      title: '请问需要反馈什么问题？',
      content: '你也可以在个人中心的反馈帮助中心里找到这个功能',
      onConfirm: () => {

      },
    });
  },
  noTitleAlert() {
    Dialog.alert({
      content: '你也可以在个人中心的反馈帮助中心里找到这个功能',
      onConfirm: () => {

      },
    });
  },
  verticalShow() {
    Dialog.show({
      title: '请问需要反馈什么问题？',
      content: '你也可以在个人中心的反馈帮助中心里找到这个功能',
      verticalButtons: true,
      buttons: [
        {
          text: '遇到问题',
          onTap: () => { },
        },
        {
          text: '意见建议',
          onTap: () => { },
        },
        {
          text: '没啥事',
          onTap: () => { },
        },
      ],
    });
  },
  advancedShow() {
    Dialog.show({
      title: 'dialog的高级用法',
      content: '你可以高度自定义每一个按钮选项',
      verticalButtons: true,
      buttons: [
        {
          openType: 'getPhoneNumber',
          text: 'getPhoneNumber',
          textColor: 'red',
          onGetPhoneNumber: (o) => {
            console.log(o);
          },
        },
        {
          openType: 'openSetting',
          text: 'openSetting',
          textColor: 'green',
          onOpenSetting: (o) => {
            console.log(o);
          },
        },
        {
          text: '没啥事',
          textColor: 'blue',
          onTap: () => { },
        },
      ],
    });
  }
});