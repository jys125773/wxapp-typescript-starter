import { get, isObject, compose, getType } from './util';

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
    range: '%s必须在%s与%s个字符之间',
  },
  number: {
    len: '%s必须等于%s',
    min: '%s不能小于%s',
    max: '%s不能大于%s',
    range: '%s必须在%s与%s之间',
  },
  array: {
    len: '%s长度必须是%s',
    min: '%s长度至少是%s',
    max: '%s长度不能超过%s',
    range: '%s长度必须在%s与%s之间',
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
    mobile: '请输入正确的手机号',
  },
};

const PATTERNS = {
  email: /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
  mobile: /^0?1[3|4|5|8|7|9|6|9][0-9]\d{8}$/,
};

const hasProp = Object.prototype.hasOwnProperty;

function sprintf(...args: any[]): string {
  const template = args[0];
  let index = 0;
  return template.replace(/%s/g, () => args[++index]);
}

type TValidateMethods = (
  value: any,
  callback: (error?: TFieldError) => void,
  options: TValidateOptions,
  rule: TFieldRule,
  source: any,
) => void;

type TvalidateMiddleware = (
  next: (errors: TFieldError[]) => void,
) => (errors: TFieldError[]) => void;

type TRuleType =
  | 'type'
  | 'required'
  | 'enum'
  | 'equal'
  | 'whitespace'
  | 'pattern'
  | 'len'
  | 'min'
  | 'max'
  | 'range'
  | 'validator';
interface TFieldError {
  field: string;
  message: string;
  ruleType?: TRuleType;
}
interface TValidateOptions {
  field: string;
  fullField: string;
  label?: string;
}
interface TFieldRule {
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
  range?: number[];
  type?:
    | 'string'
    | 'array'
    | 'object'
    | 'number'
    | 'date'
    | 'boolean'
    | 'regexp'
    | 'integer'
    | 'float'
    | 'email'
    | 'mobile';
  defaultField?: TFieldRule;
  validator?: TValidateMethods;
}
interface TRules {
  required: TValidateMethods;
  whitespace: TValidateMethods;
  enum: TValidateMethods;
  equal: TValidateMethods;
  pattern: TValidateMethods;
  range: TValidateMethods;
  type: TValidateMethods;
}
export interface TDescriptor {
  [prop: string]:
    | TFieldRule & { fields?: TDescriptor }
    | (TFieldRule & { fields?: TDescriptor })[];
}
interface TErrorsMap {
  [prop: string]: {
    required?: string;
    whitespace?: string;
    enum?: string;
    equal?: string;
    pattern?: string;
    len?: string;
    min?: string;
    max?: string;
    range?: string;
    type?: string;
  };
}

const RULES: TRules = {
  required(value, callback, options, rule) {
    const { fullField, label } = options;
    if (
      rule.required &&
      (value === '' ||
        typeof value === 'undefined' ||
        (Array.isArray(value) && value.length === 0))
    ) {
      return callback({
        field: fullField,
        message: rule.message || sprintf(MESSAGES.required, label || fullField),
      });
    }
    return callback();
  },
  whitespace(value, callback, options, rule) {
    const { fullField, label } = options;
    if (/^\s+$/.test(value) || value === '') {
      return callback({
        field: fullField,
        message:
          rule.message || sprintf(MESSAGES.whitespace, label || fullField),
      });
    }
    return callback();
  },
  enum(value, callback, options, rule) {
    const { fullField, label } = options;
    const enumItems = Array.isArray(rule.enum) ? rule.enum : [];
    if (enumItems.indexOf(value) === -1) {
      return callback({
        field: fullField,
        message:
          rule.message ||
          sprintf(
            MESSAGES.enum,
            label || fullField,
            (rule.enum || []).join(','),
          ),
      });
    }
    return callback();
  },
  equal(value, callback, options, rule) {
    const { fullField, label } = options;
    if (value !== rule.equal) {
      return callback({
        field: fullField,
        message:
          rule.message ||
          sprintf(MESSAGES.equal, label || fullField, rule.equal),
      });
    }
    return callback();
  },
  pattern(value, callback, options, rule) {
    const { pattern } = rule;
    const { fullField, label } = options;
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (!pattern.test(value)) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES.pattern, label || fullField),
        });
      }
    }
    return callback();
  },
  range(value, callback, options, rule) {
    let { min, max } = rule as { min: number; max: number };
    const { range, len } = rule;
    const { fullField, label } = options;
    const valueType = typeof value;
    const NUMBER_TYPE = 'number';
    let key: string | undefined;
    let val: any;
    if (valueType === 'string') {
      key = 'string';
      val = value.length;
    } else if (valueType === NUMBER_TYPE) {
      key = NUMBER_TYPE;
      val = value;
    } else if (Array.isArray(value)) {
      key = 'array';
      val = value.length;
    }
    if (!key || typeof val !== NUMBER_TYPE) {
      return callback();
    }
    if (Array.isArray(range) && range[0] < range[1]) {
      min = range[0];
      max = range[1];
    }
    const hasMin = typeof min === NUMBER_TYPE;
    const hasMax = typeof max === NUMBER_TYPE;
    const hasLen = typeof len === NUMBER_TYPE;
    if (hasLen) {
      if (val !== len) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES[key].len, label || fullField, len),
        });
      }
    } else if (hasMin && hasMax) {
      if (val > max || val < min) {
        return callback({
          field: fullField,
          message:
            rule.message ||
            sprintf(MESSAGES[key].range, label || fullField, min, max),
        });
      }
    } else if (hasMin) {
      if (val < min) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES[key].min, label || fullField, min),
        });
      }
    } else if (hasMax) {
      if (val > max) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES[key].max, label || fullField, max),
        });
      }
    }
    return callback();
  },
  type(value, callback, options, rule) {
    const type = rule.type as string;
    const { fullField, label } = options;
    const pattern = PATTERNS[type];
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (!pattern.test(value)) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES.type[type], label || fullField),
        });
      }
      return callback();
    }
    const valueType = getType(value);
    const isNum = valueType === 'number';
    if (type === 'integer') {
      if (!isNum || parseInt(value, 10) !== value) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES.type.integer, label || fullField),
        });
      }
    } else if (type === 'float') {
      if (!isNum || parseInt(value, 10) === value) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(MESSAGES.type.float, label || fullField),
        });
      }
    } else if (valueType !== type) {
      return callback({
        field: fullField,
        message:
          rule.message || sprintf(MESSAGES.type[type], label || fullField),
      });
    }
    return callback();
  },
};

class Xvalidator {
  private descriptor: TDescriptor = {};
  private useErrorsMap = false;
  public errorsMap: TErrorsMap = {};
  constructor(descriptor: TDescriptor, options?: { useErrorsMap: boolean }) {
    this.descriptor = descriptor;
    this.useErrorsMap = options ? options.useErrorsMap : false;
  }
  private getValidateMethod(rule: TFieldRule, ruleType: string) {
    let validateMethod = rule.validator || RULES[ruleType];
    if (ruleType === 'len' || ruleType === 'min' || ruleType === 'max') {
      validateMethod = RULES.range;
    }
    return validateMethod as TValidateMethods;
  }
  private tranverseValidate(
    source: any,
    descriptor: TDescriptor,
    paths: (string | number)[],
    firstField: boolean | string,
    validateMiddlewares: TvalidateMiddleware[],
    validateCallback: (errors: TFieldError[]) => void,
  ) {
    for (const key in descriptor) {
      const descriptorItem = descriptor[key];
      const sourceItem = source[key];
      const own = hasProp.call(source, key);
      const deep = isObject(sourceItem) || Array.isArray(sourceItem);
      const nextPaths = paths.concat(Number(key) % 1 === 0 ? `[${key}]` : key);
      const fullField = nextPaths.join('.').replace(/\.\[/g, '[');
      const rules = Array.isArray(descriptorItem)
        ? descriptorItem
        : [descriptorItem];
      const ruleLen = rules.length;
      for (let i = 0; i < ruleLen; i++) {
        const { fields, label, defaultField, ...rule } = rules[
          i
        ] as TFieldRule & { fields?: TDescriptor };
        const ruleKeys = Object.keys(rule);
        const ruleKeysLen = ruleKeys.length;
        if (deep && (fields || defaultField)) {
          if (fields) {
            this.tranverseValidate(
              sourceItem,
              fields,
              nextPaths,
              firstField,
              validateMiddlewares,
              validateCallback,
            );
          } else if (defaultField) {
            const defaultFields: { [prop: string]: TFieldRule } = {};
            for (const k in sourceItem) {
              defaultFields[k] = defaultField;
            }
            this.tranverseValidate(
              sourceItem,
              defaultFields,
              nextPaths,
              firstField,
              validateMiddlewares,
              validateCallback,
            );
          }
        } else if ((own || rule.required) && ruleKeysLen > 0) {
          for (let j = 0; j < ruleKeysLen; j++) {
            const ruleType = ruleKeys[j];
            const validateMethod = this.getValidateMethod(rule, ruleKeys[j]);
            if (validateMethod) {
              validateMiddlewares.push(next => errors => {
                validateMethod(
                  sourceItem,
                  error => {
                    const errorsMapItem = this.errorsMap[fullField];
                    if (error) {
                      error.ruleType = ruleType as any;
                      errors.push(error);
                      if (this.useErrorsMap) {
                        if (!errorsMapItem) {
                          this.errorsMap[fullField] = {
                            [ruleType]: error.message,
                          };
                        } else {
                          errorsMapItem[ruleType] = error.message;
                        }
                      }
                      if (firstField === true || firstField === fullField) {
                        validateCallback(errors);
                        return;
                      }
                    } else if (this.useErrorsMap && errorsMapItem) {
                      delete errorsMapItem[ruleType];
                    }
                    next(errors);
                  },
                  { field: key, fullField, label },
                  rule,
                  source,
                );
              });
            }
          }
        }
      }
    }
  }
  public validate(
    source: any,
    options: { fullField?: string; firstField?: string | boolean } = {},
    callback: (errors: TFieldError[], errorsMap: TErrorsMap | null) => void,
  ) {
    const { fullField = '', firstField = false } = options;
    let { descriptor } = this;
    if (fullField) {
      descriptor = {
        [fullField]: get(
          descriptor,
          fullField
            .replace(/\[/g, '.')
            .replace(/\]/g, '')
            .split('.')
            .join('.fields.'),
        ),
      };
      source = { [fullField]: source };
    }
    const validateCallback = (errors: TFieldError[]) => {
      callback(errors, this.useErrorsMap ? this.errorsMap : null);
    };
    const validateMiddlewares: TvalidateMiddleware[] = [];
    this.tranverseValidate(
      source,
      descriptor,
      [],
      firstField,
      validateMiddlewares,
      validateCallback,
    );
    const dispatch = compose(validateMiddlewares)(validateCallback);
    dispatch([]);
  }
}

export default Xvalidator;

// var descriptor: TDescriptor = {
//   address: {
//     type: 'object',
//     // required: true,
//     fields: {
//       street: [{ type: 'number', min: 2, required: true, label: '' }],
//       city: { type: 'string' },
//       zip: { type: 'string', len: 8, message: 'invalid zip' },
//       pres: {
//         type: 'array',
//         fields: {
//           0: [
//             { type: 'number' },
//             {
//               validator(value, callback, options, rule, source) {
//                 // console.log('validator', arguments)
//                 // callback({ field: options.fullField, message: '12345' });
//                 setTimeout(() => {
//                   callback({
//                     field: options.fullField,
//                     message: '异步验证错误信息',
//                     ruleType: 'validator',
//                   });
//                 }, 5000);
//               },
//             },
//           ],
//         },
//       },
//     },
//   },
//   name: { type: 'string', required: true },
//   urls: {
//     required: true,
//     type: 'array',
//     defaultField: {
//       type: 'string',
//     },
//   },
// };

// var validator = new Xvalidator(descriptor, { useErrorsMap: true });
// validator.validate(
//   {
//     address: {
//       pres: [''],
//     },
//     name: 1,
//     urls: [1, '2', 3],
//   },
//   { firstField: false },
//   (errors, errorsMap) => {
//     console.log('errors', errors);
//     console.log('errorsMap', errorsMap);
//   },
// );

// validator.validate(
//   {
//     address:{}
//   },
//   { fullField: 'address', firstField: false },
//   (errors, errorsMap) => {
//     console.log('errors', errors)
//     console.log('errorsMap', errorsMap)
//   }
// );
