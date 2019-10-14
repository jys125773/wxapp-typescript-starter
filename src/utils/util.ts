const _toString = Object.prototype.toString;

function isObject(value: any) {
  return _toString.call(value) === '[object Object]';
}

function isArray(value: any) {
  return _toString.call(value) === '[object Array]';
}

function isFunction(value: any) {
  return typeof value === 'function';
}

function isNaN(value: any) {
  return value !== value;
}

function isNumer(value: any) {
  return typeof value === 'number' && !isNaN(value);
}

function isNull(value: any) {
  return _toString.call(value) === '[object Null]';
}

function isBoolean(value: any) {
  return typeof value === 'boolean';
}

function get(source: any, paths: string[] | string, defaultValue: any) {
  if (typeof paths === 'string') {
    paths = paths
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.');
  }
  const { length } = paths;
  let index = 0;
  while (source != null && index < length) {
    source = source[paths[index++]];
  }
  return source === undefined || index === 0 ? defaultValue : source;
}

function merge(target: IAnyObject, source: IAnyObject) {
  let value: any, mergeValue: any;
  for (const prop in source) {
    if (source.hasOwnProperty(prop)) {
      value = target[prop];
      mergeValue = source[prop];
      if (isObject(mergeValue) && isObject(value)) {
        target[prop] = merge(value, mergeValue);
      } else {
        target[prop] = mergeValue;
      }
    }
  }
  return target;
}

function throttle(func: Function, wait = 100) {
  const last = 0;
  return function throttled(this: any) {
    const now = Date.now();
    if (now - last >= wait) {
      // eslint-disable-next-line prefer-rest-params
      return func.apply(this, arguments);
    }
  };
}

export {
  isObject,
  isArray,
  isFunction,
  isNaN,
  isNumer,
  isNull,
  isBoolean,
  get,
  merge,
  throttle,
};

export default {
  isObject,
  isArray,
  isFunction,
  isNaN,
  isNumer,
  isNull,
  get,
  merge,
  throttle,
};
