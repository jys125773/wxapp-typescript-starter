type TAnyObject = Record<string, any>;

const _hasOwnProperty = Object.prototype.hasOwnProperty;
const _toString = Object.prototype.toString;
const _keys = Object.keys;
const OBJECT_TYPE = '[object Object]';
const ARRAY_TYPE = '[object Array]';
const FUNCTION_TYPE = '[object Function]';

function setDiff(target: TAnyObject, propName: string, propValue: any) {
  if (_toString.call(propValue) !== FUNCTION_TYPE && propName !== '') {
    target[propName] = propValue;
  }
}

function syncDiff(
  to: any,
  from: any,
  result: TAnyObject = {},
  path: string = '',
) {
  //全等 => 跳过
  if (to === from) {
    return;
  }
  const toType = _toString.call(to);
  const fromType = _toString.call(from);
  if (toType !== fromType) {
    //类型不同 => 使用新值
    setDiff(result, path, to);
    return;
  }
  if (toType !== OBJECT_TYPE && toType !== ARRAY_TYPE) {
    //类型相同、基础数据类型 => 使用新值
    setDiff(result, path, to);
    return;
  }
  if (toType === OBJECT_TYPE) {
    const toKeys = _keys(to);
    const toKeysLen = toKeys.length;
    const fromKeys = _keys(from);
    const fromKeysLen = fromKeys.length;
    let toItem: any, toKey: string;
    for (let i = 0; i < fromKeysLen; i++) {
      if (!_hasOwnProperty.call(to, fromKeys[i])) {
        setDiff(result, path, to);
      }
    }
    if (!_hasOwnProperty.call(result, path)) {
      for (let i = 0; i < toKeysLen; i++) {
        toKey = toKeys[i];
        toItem = to[toKey];
        if (_hasOwnProperty.call(from, toKey)) {
          //都是对象，新老对象都有的属性 => 逐项 diff、按路径更新
          syncDiff(
            toItem,
            from[toKey],
            result,
            path ? `${path}.${toKey}` : toKey,
          );
        } else {
          //都是对象，新增字段 => 使用新值
          setDiff(result, path ? `${path}.${toKey}` : toKey, toItem);
        }
      }
    }
  } else if (toType === ARRAY_TYPE) {
    const toArrayLen = to.length;
    if (toArrayLen < from.length) {
      //都是数组、新数组比旧数组短 => 使用新值
      setDiff(result, path, to);
    } else {
      for (let i = 0; i < toArrayLen; i++) {
        //都是数组、新数组长度大于等于旧数组的长度 => 逐项 diff、按路径更新
        syncDiff(to[i], from[i], result, path ? `${path}[${i}]` : `[${i}]`);
      }
    }
  }
}

export default function diff(to: any, from: any) {
  const result: TAnyObject = {};
  syncDiff(to, from, result);
  return result;
}
