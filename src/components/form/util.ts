import { isObject, isString, isArray } from '../../utils/util';

const NATURAL_NUM_REG = /^(?:0|[1-9]\d*)$/;

export function setDescriptorItem(
  descriptor: any,
  prop: string,
  rules: any,
  label: string,
) {
  //小程序data不支持正则传值，rule的pattern需要是string然后在这里使用RegExp构建为正则
  rules.forEach(rule => {
    const { pattern } = rule;
    if (isString(pattern)) {
      rule.pattern = new RegExp(pattern);
    } else if (isArray(pattern)) {
      rule.pattern = new RegExp(pattern[0], pattern[1]);
    }
    rule.label = label;
  });
  const path = prop
    .replace(/\[/g, '.')
    .replace(/\]/g, '')
    .split('.');
  let index = -1,
    { length } = path,
    lastIndex = length - 1,
    nested = descriptor;
  while (nested != null && ++index < length) {
    const key = path[index];
    let newValue = rules;
    if (index !== lastIndex) {
      const objValue = nested[key];
      if (isObject(objValue)) {
        nested[key] = objValue;
        nested = nested[key];
      } else {
        newValue = {
          type: NATURAL_NUM_REG.test(path[index + 1]) ? 'array' : 'object',
          fields: [],
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
