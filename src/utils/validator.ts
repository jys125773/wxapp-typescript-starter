import { get, isObject } from './util';

const MESSAGES = {
  required: '%s是必填项',
  enum: '%s必须是%s其中的一个',
  equal: '%s必须等于%s',
  whitespace: '%s不能为空',
  pattern: '请输入正确的%s',
  string: {
    len: '%s必须是%s个字符',
    min: '%s至少是%s个字符',
    max: '%s不能超过%s个字符',
    range: '%s必须在%s与%s个字符之间'
  },
  number: {
    len: '%s必须等于%s',
    min: '%s不能小于%s',
    max: '%s不能大于%s',
    range: '%s必须在%s与%s之间'
  },
  array: {
    len: '%s长度必须是%s',
    min: '%s长度至少是%s',
    max: '%s长度不能超过%s',
    range: '%s长度必须在%s与%s之间'
  },
  type: {
    string: '%s必须是字符',
    array: '%s必须是数组',
    object: '%s必须是对象',
    number: '%s必须是数字',
    date: '%s必须是日期',
    boolean: '%s必须是布尔值',
    regexp: '%s必须是正则表达式',
    integer: '%s必须是整数',
    float: '%s必须是小数',
    email: '请输入正确的邮箱',
    mobile: '请输入正确的手机号'
  },
};

const PATTERNS = {
  email: /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
  mobile: /^0?1[3|4|5|8|7|9|6|9][0-9]\d{8}$/,
};

const toStr = Object.prototype.toString;
const hasProp = Object.prototype.hasOwnProperty;

function sprintf(...args: any[]): string {
  const template = args[0];
  let index = 0;
  return template.replace(/%s/g, () => args[++index]);
}

type TFieldError = { field: string; message: string; }
type TValidateMethodsOptions = { field: string; fullField: string; label?: string };
type TValidateMethods = (
  value: any,
  rule: TFieldRule,
  source: any,
  options: TValidateMethodsOptions,
  callback: (error?: TFieldError) => void,
) => void;
type TFieldRule = {
  label?: string;
  message?: string;
  required?: boolean;
  enum?: any[];
  equal?: any;
  whitespace?: boolean;
  pattern?: RegExp;
  len?: number;
  min?: number;
  max?: number;
  range?: number[],
  type?: 'string' | 'array' | 'object' | 'number' | 'date'
  | 'boolean' | 'regexp' | 'integer' | 'float' | 'email' | 'mobile';
  defaultField?: TFieldRule,
  validator?: TValidateMethods;
}
type TRules = {
  required: TValidateMethods;
  whitespace: TValidateMethods;
  enum: TValidateMethods;
  equal: TValidateMethods;
  pattern: TValidateMethods;
  range: TValidateMethods;
  type: TValidateMethods;
}
type TDescriptor = {
  [prop: string]: TFieldRule & { fields?: TDescriptor }
  | Array<TFieldRule & { fields?: TDescriptor }>;
}

const RULES: TRules = {
  required(value, rule, _source, options, callback) {
    const { fullField, label } = options;
    if (
      rule.required &&
      (
        value === '' ||
        typeof value === 'undefined' ||
        Array.isArray(value) && value.length === 0
      )
    ) {
      return callback({
        field: fullField,
        message: rule.message || sprintf(MESSAGES.required, label || fullField),
      });
    }
    return callback();
  },
  whitespace(value, rule, _source, options, callback) {
    const { fullField, label } = options;
    if (/^\s+$/.test(value) || value === '') {
      return callback({
        field: fullField,
        message: rule.message || sprintf(MESSAGES.whitespace, label || fullField),
      });
    }
    return callback();
  },
  enum(value, rule, _source, options, callback) {
    const { fullField, label } = options;
    const enumItems = Array.isArray(rule.enum) ? rule.enum : [];
    if (enumItems.indexOf(value) === -1) {
      return callback({
        field: fullField,
        message: rule.message || sprintf(MESSAGES.enum, label || fullField, (rule.enum || []).join(',')),
      });
    }
    return callback();
  },
  equal(value, rule, _source, options, callback) {
    const { fullField, label } = options;
    if (value !== rule.equal) {
      return callback({
        field: fullField,
        message: rule.message || sprintf(MESSAGES.equal, label || fullField, rule.equal),
      });
    }
    return callback();
  },
  pattern(value, rule, _source, options, callback) {
    const { pattern } = rule;
    const { fullField, label } = options;
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (!(pattern.test(value))) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES.pattern, label || fullField),
        });
      }
    }
    return callback();
  },
  range(value, rule, _source, options, callback) {
    let { min, max, len, range } = rule;
    const { fullField, label } = options;
    const valueType = typeof value;
    let key: string | undefined;
    let val: number | undefined;
    if (valueType === 'string') {
      key = 'string';
      val = value.length;
    } else if (valueType === 'number') {
      key = 'number';
      val = value;
    } else if (Array.isArray(value)) {
      key = 'array';
      val = value.length;
    }
    if (!key || typeof val !== 'number') {
      return callback();
    }
    if (Array.isArray(range) && range[0] < range[1]) {
      min = range[0];
      max = range[1];
    }
    if (typeof len === 'number') {
      if (val !== len) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES[key].len, label || fullField, len),
        });
      }
    } else if (typeof min === 'number' && typeof max === 'number') {
      if (val > max || val < min) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES[key].range, label || fullField, min, max),
        });
      }
    } else if (typeof min === 'number') {
      if (val < min) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES[key].min, label || fullField, min),
        });
      }
    } else if (typeof max === 'number') {
      if (val > max) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES[key].max, label || fullField, max),
        });
      }
    }
    return callback();
  },
  type(value, rule, _source, options, callback) {
    const type = rule.type as string;
    const { fullField, label } = options;
    const pattern = PATTERNS[type];
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (!(pattern.test(value))) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES.type[type], label || fullField),
        });
      }
      return callback();
    }
    let valueType: any = toStr.call(value).match(/\[object\s(\w+)\]/);
    if (valueType && valueType[1]) {
      valueType = valueType[1].toLowerCase();
    }
    const isNum = valueType === 'number'
    if (type === 'integer') {
      if (!isNum || parseInt(value, 10) !== value) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES.type.integer, label || fullField),
        });
      }
    } else if (type === 'float') {
      if (!isNum || parseInt(value, 10) === value) {
        return callback({
          field: fullField,
          message: rule.message || sprintf(MESSAGES.type.float, label || fullField),
        });
      }
    } else if (valueType !== type) {
      return callback({
        field: fullField,
        message: rule.message || sprintf(MESSAGES.type[type], label || fullField),
      });
    }
    return callback();
  }
}

class Validator {
  private descriptor: TDescriptor = {};

  constructor(descriptor: TDescriptor) {
    this.descriptor = descriptor;
  }

  private getValidateMethod(rule: TFieldRule, methodName: string) {
    let validateMethod = rule.validator || RULES[methodName];
    if (methodName === 'len' || methodName === 'min' || methodName === 'max') {
      validateMethod = RULES.range;
    }
    return validateMethod as TValidateMethods;
  }

  public validate(
    source: any,
    options: { fullField?: string, firstField?: string | boolean } = {},
  ) {
    const that = this;
    const errors: TFieldError[] = [];
    const chain: (() => Promise<any>)[] = [];
    const { fullField = '', firstField } = options;
    let descriptor = this.descriptor;
    if (fullField) {
      descriptor = {
        [fullField]: get(this.descriptor, fullField.split('.').join('.fields.'))
      };
      source = { [fullField]: source };
    }

    function tranverseValidate(
      _source: any,
      _descriptor: TDescriptor,
      paths: (string | number)[]
    ) {
      for (const key in _descriptor) {
        const descriptorItem = _descriptor[key];
        const sourceItem = _source[key];
        const own = hasProp.call(_source, key);
        const deep = isObject(sourceItem) || Array.isArray(sourceItem);
        const _key = Number(key);
        const _paths = paths.concat(_key % 1 === 0 ? `[${_key}]` : key);
        const fullField = _paths.join('.').replace(/\.\[/g, '[');
        const rules = Array.isArray(descriptorItem) ? descriptorItem : [descriptorItem];
        const ruleLen = rules.length;
        for (let i = 0; i < ruleLen; i++) {
          const {
            fields,
            label,
            defaultField,
            ...rule
          } = rules[i] as TFieldRule & { fields?: TDescriptor };
          if (deep && (fields || defaultField)) {
            if (fields) {
              tranverseValidate(sourceItem, fields, _paths);
            } else if (defaultField) {
              const defaultFields: { [prop: string]: TFieldRule } = {};
              for (const k in sourceItem) {
                defaultFields[k] = defaultField;
              }
              tranverseValidate(sourceItem, defaultFields, _paths);
            }
          } else if (
            (own || rule.required)
            && Object.keys(rule).length
          ) {
            for (const methodName in rule) {
              const validateMethod = that.getValidateMethod(rule, methodName);
              chain.push(() => new Promise((resolve, reject) => {
                try {
                  validateMethod(
                    sourceItem,
                    rule,
                    source,
                    { field: key, fullField, label },
                    (error) => {
                      if (error) {
                        errors.push(error);
                        if (firstField === true || firstField === fullField) {
                          return reject();
                        }
                      }
                      resolve();
                    });
                } catch (e) {
                  reject(e);
                }
              }));
            }
          }
        }
      }
    }

    tranverseValidate(source, descriptor, []);

    let _resolve: (errors: TFieldError[]) => void;
    let _reject: (e: Error) => void;
    const ret = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
    chain.
      slice(1)
      .reduce((acc, item) => acc.then(item), chain[0]())
      .then(() => _resolve(errors))
      .catch((e) => {
        if (e) {
          _reject(e);
        } else {
          _resolve(errors)
        }
      });
    return ret;
  }
}

export default Validator;

var descriptor: TDescriptor = {
  address: {
    type: "object",
    // required: true,
    fields: {
      street: [{ type: "number", min: 2, required: true, label: '' }],
      city: { type: "string", },
      zip: { type: "string", len: 8, message: "invalid zip" },
      pres: {
        type: "array",
        fields: {
          0: [
            { type: 'number' },
            {
              validator(value, rule, source, options, callback) {
                // console.log('validator', arguments)
                // callback({ field: options.fullField, message: '12345' });
                setTimeout(() => {
                  callback({ field: options.fullField, message: '异步验证错误信息' });
                }, 500);
              }
            }
          ]
        }
      }
    }
  },
  name: { type: "string", required: true },
  urls: {
    required: true,
    type: 'array',
    defaultField: {
      type: 'string'
    }
  }
}

var validator = new Validator(descriptor);
validator.validate(
  {
    address: {
      pres: ['']
    },
    name: 1,
    urls: [1, '2', 3]
  },
  // { firstField: true }
).then((errors) => {
  console.log('errors', errors)
});

validator.validate(
  1,
  { fullField: 'address.street' }
).then((errors) => {
  console.log('errors', errors)
});
