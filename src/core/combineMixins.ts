import { isObject, isArray, isFunction, merge } from '../utils/util';

const pageLifeTimesMap = {
  onLoad: true,
  onShow: true,
  onReady: true,
  onHide: true,
  onUnload: true,
  onPullDownRefresh: true,
  onReachBottom: true,
  onShareAppMessage: true,
  onPageScroll: true,
  onResize: true,
  onTabItemTap: true
};

function compose(...funcs: Function[]) {
  return function (this: any) {
    const ctx = this;
    const args = arguments;
    return funcs.slice(1).reduce(
      (acc, func) => acc.then(() => func.apply(ctx, args)),
      Promise.resolve(funcs[0].apply(ctx, args))
    );
  };
}

function combineMixins<D, T>(options: WxPage<D, T>) {
  const { mixins } = options;
  if (!mixins) {
    return options;
  }
  const finalOptions: WxPage = {};
  mixins.forEach(mixin => {
    Object.keys(mixin).forEach(propName => {
      const propValue = mixin[propName];
      //mixin中与Page生命周期同名的函数
      if (pageLifeTimesMap[propName] && isFunction(propValue)) {
        if (isArray(finalOptions[propName])) {
          finalOptions[propName].push(propValue);
        } else {
          finalOptions[propName] = [propValue];
        }
      }
      //mixin与Page中的data深度合并
      if (propName === "data" && isObject(propValue)) {
        finalOptions.data = merge(finalOptions.data || {}, propValue);
      }
      //mixin其他的属性，后面覆盖前面的
      if (!pageLifeTimesMap[propName] && propName !== "data") {
        finalOptions[propName] = propValue;
      }
    });
  });
  //组合Page生命周期函数
  Object.keys(finalOptions).forEach(propName => {
    const pageLifeMethods = finalOptions[propName];
    if (pageLifeTimesMap[propName] && isArray(pageLifeMethods)) {
      finalOptions[propName] = compose(pageLifeMethods);
    }
  });
  return finalOptions;
}

export default combineMixins;