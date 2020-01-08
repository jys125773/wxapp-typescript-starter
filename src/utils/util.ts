const toStr = Object.prototype.toString;

function isObject(value: any) {
  return toStr.call(value) === '[object Object]';
}

function isArray(value: any) {
  return toStr.call(value) === '[object Array]';
}

function isFunction(value: any) {
  return typeof value === 'function';
}

function isNaN(value: any) {
  return value !== value;
}

function isNumber(value: any) {
  return typeof value === 'number' && !isNaN(value);
}

function isNull(value: any) {
  return toStr.call(value) === '[object Null]';
}

function isBoolean(value: any) {
  return typeof value === 'boolean';
}

function isString(value: any) {
  return typeof value === 'string';
}

function caskPath(path: string[] | string): string[] {
  if (typeof path === 'string') {
    return path
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.');
  }
  return path;
}

function get(source: any, path: string[] | string, defaultValue?: any) {
  const paths = caskPath(path);
  const { length } = paths;
  let index = 0;
  while (source != null && index < length) {
    source = source[paths[index++]];
  }
  return source === undefined || index === 0 ? defaultValue : source;
}

function set(source: any, path: string[] | string, value?: any) {
  const paths = caskPath(path),
    { length } = paths,
    lastIndex = length - 1;
  let index = -1,
    nested = source;
  while (nested != null && ++index < length) {
    const key = paths[index];
    let newValue = value;
    if (index !== lastIndex) {
      const objValue = nested[key];
      newValue =
        isObject(objValue) || isArray(objValue)
          ? objValue
          : isIndex(paths[index + 1])
          ? []
          : {};
    }
    nested[key] = newValue;
    nested = nested[key];
  }
  return source;
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

function mergeAll(...args: IAnyObject[]) {
  const result = {};
  args.forEach(target => {
    merge(result, target);
  });
  return result;
}

function compose(funcs: Function[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args: any[]) => a(b(...args)));
}

const TO_STRING_REG = /\[object\s(\w+)\]/;
const TO_STRING_MEMORIZE_MAP: Record<string, string> = {};
function getType(value: any) {
  const typeKey = toStr.call(value);
  let type = TO_STRING_MEMORIZE_MAP[typeKey];
  if (!type) {
    const match = typeKey.match(TO_STRING_REG);
    type = match && match[1] ? match[1].toLowerCase() : '';
    if (type) {
      TO_STRING_MEMORIZE_MAP[typeKey] = type;
    }
  }
  return type;
}

const NATURAL_NUM_REG = /^(?:0|[1-9]\d*)$/;
function isIndex(value: string | number) {
  return typeof value === 'string'
    ? NATURAL_NUM_REG.test(value)
    : value >= 0 && value % 1 === 0;
}

export {
  isObject,
  isArray,
  isFunction,
  isNaN,
  isNumber,
  isNull,
  isBoolean,
  isString,
  get,
  set,
  merge,
  compose,
  getType,
  isIndex,
};

export default {
  isObject,
  isArray,
  isFunction,
  isNaN,
  isNumber,
  isNull,
  isBoolean,
  isString,
  get,
  set,
  merge,
  mergeAll,
  compose,
  getType,
  isIndex,
};
