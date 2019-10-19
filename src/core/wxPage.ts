import { isBoolean, isFunction, isArray } from '../utils/util';
import combineMixins from './combineMixins';
import diff from './diff';

const commonMixins = [];

function wxPage(PageInstance: any) {
  const instance = new PageInstance();
  const originalSetData = instance.setData;
  const originalMixins = isArray(instance.mixins) ? instance.mixins : [];
  instance.setData = function(
    updates: IAnyObject,
    callback: Function | boolean,
    doDiff: boolean = false,
  ) {
    if (isBoolean(callback)) {
      doDiff = callback as boolean;
    }
    if (doDiff) {
      const { data } = this;
      const diffs = diff(Object.assign({}, data, updates), data);
      originalSetData(diffs, () => {
        isFunction(callback) && (callback as Function)(diffs);
      });
    } else {
      originalSetData(updates, callback);
    }
  };
  instance.mixins = originalMixins.concat(commonMixins);
  return Page(combineMixins(instance));
}
export default wxPage;

// @wxPage
// class A implements WxPage<{ a: string }, { age: number }>{
//   public data = {
//     a: '1'
//   }
//   public age = 10;

//   onLoad() {

//   }
// }
