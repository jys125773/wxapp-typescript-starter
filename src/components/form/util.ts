import { isObject, isString, isArray, isIndex } from '../../utils/util';

export function setDescriptorItem(
  descriptor: any,
  prop: string,
  rules: any,
  label?: string,
) {
  //小程序data不支持正则传值，rule的pattern需要是string然后在这里使用RegExp构建为正则
  rules.forEach(rule => {
    const { pattern } = rule;
    if (isString(pattern)) {
      rule.pattern = new RegExp(pattern);
    } else if (isArray(pattern)) {
      rule.pattern = new RegExp(pattern[0], pattern[1]);
    }
    if (label) {
      rule.label = label;
    }
  });
  const path = prop
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.'),
    len = path.length,
    lastIndex = len - 1;
  let index = -1,
    nested = descriptor;
  while (nested != null && ++index < len) {
    const key = path[index];
    let newValue = rules;
    if (index !== lastIndex) {
      const objValue = nested[key];
      if (objValue && isObject(objValue.fields)) {
        nested = objValue.fields;
      } else if (isObject(objValue)) {
        nested = nested[key];
      } else {
        newValue = {
          type: isIndex(path[index + 1]) ? 'array' : 'object',
          required: true,
          fields: {},
        };
        nested[key] = newValue;
        nested = nested[key].fields;
      }
    } else {
      nested[key] = newValue;
      nested = nested[key];
    }
  }
  return descriptor;
}
