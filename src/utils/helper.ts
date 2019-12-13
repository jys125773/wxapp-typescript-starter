export const getSystemInfo = (function () {
  let systemInfo: wx.GetSystemInfoSyncResult | null = null;
  return function () {
    if (!systemInfo) {
      systemInfo = wx.getSystemInfoSync();
    }
    return systemInfo;
  }
})();

export function px2rpx(value: number) {
  const { windowWidth } = getSystemInfo();
  return value * 750 / windowWidth;
}

export function rpx2px(value: number) {
  const { windowWidth } = getSystemInfo();
  return value * windowWidth / 750;
}

export function getCurrentPage() {
  const pages = getCurrentPages();
  return pages[pages.length - 1];
}