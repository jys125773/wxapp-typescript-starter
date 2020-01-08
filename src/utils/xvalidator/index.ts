import messages from './messages';
import patterns from './patterns';
import {
  ValidateOptions,
  Rules,
  FieldError,
  Descriptor,
  FieldRule,
  ValidateMethod,
  ValidateMiddleware,
} from './types';
import { get, isObject, isArray, getType, isIndex, compose } from '../util';

const hasProp = Object.prototype.hasOwnProperty;

function sprintf(...args: any[]): string {
  const template = args[0];
  let index = 0;
  return template.replace(/%s/g, () => args[++index]);
}

const RULES: Rules = {
  required(value, callback, options, rule) {
    const { fullField, label } = options;
    if (
      rule.required &&
      (value === '' ||
        typeof value === 'undefined' ||
        (isArray(value) && value.length === 0))
    ) {
      return callback({
        field: fullField,
        message: rule.message || sprintf(messages.required, label || fullField),
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
          rule.message || sprintf(messages.whitespace, label || fullField),
      });
    }
    return callback();
  },
  enum(value, callback, options, rule) {
    const { fullField, label } = options;
    const enumItems = (isArray(rule.enum) ? rule.enum : []) as any[];
    if (enumItems.indexOf(value) === -1) {
      return callback({
        field: fullField,
        message:
          rule.message ||
          sprintf(
            messages.enum,
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
          sprintf(messages.equal, label || fullField, rule.equal),
      });
    }
    return callback();
  },
  equalTo(value, callback, options, rule, source) {
    const { fullField, label } = options;
    if (value !== get(source, (rule as any).equalTo)) {
      return callback({
        field: fullField,
        message:
          rule.message ||
          sprintf(messages.equalTo, label || fullField, rule.equalTo),
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
            rule.message || sprintf(messages.pattern, label || fullField),
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
    } else if (isArray(value)) {
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
            rule.message || sprintf(messages[key].len, label || fullField, len),
        });
      }
    } else if (hasMin && hasMax) {
      if (val > max || val < min) {
        return callback({
          field: fullField,
          message:
            rule.message ||
            sprintf(messages[key].range, label || fullField, min, max),
        });
      }
    } else if (hasMin) {
      if (val < min) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(messages[key].min, label || fullField, min),
        });
      }
    } else if (hasMax) {
      if (val > max) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(messages[key].max, label || fullField, max),
        });
      }
    }
    return callback();
  },
  type(value, callback, options, rule) {
    const type = rule.type as string;
    const { fullField, label } = options;
    const pattern = patterns[type];
    if (pattern instanceof RegExp) {
      pattern.lastIndex = 0;
      if (!pattern.test(value)) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(messages.type[type], label || fullField),
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
            rule.message || sprintf(messages.type.integer, label || fullField),
        });
      }
    } else if (type === 'float') {
      if (!isNum || parseInt(value, 10) === value) {
        return callback({
          field: fullField,
          message:
            rule.message || sprintf(messages.type.float, label || fullField),
        });
      }
    } else if (valueType !== type) {
      return callback({
        field: fullField,
        message:
          rule.message || sprintf(messages.type[type], label || fullField),
      });
    }
    return callback();
  },
};

class Xvalidator {
  private descriptor: Descriptor = {};
  constructor(descriptor: Descriptor) {
    this.descriptor = descriptor;
  }
  private getValidateMethod(rule: FieldRule, ruleType: string) {
    let validateMethod = rule.validator || RULES[ruleType];
    if (ruleType === 'len' || ruleType === 'min' || ruleType === 'max') {
      validateMethod = RULES.range;
    }
    return validateMethod as ValidateMethod;
  }
  private tranverseValidate(
    target: any,
    descriptor: Descriptor,
    paths: (string | number)[],
    options: ValidateOptions,
    middlewares: ValidateMiddleware[],
    validateCallback: (errors: FieldError[]) => void,
    source?: any,
  ) {
    for (const key in descriptor) {
      const descriptorItem: any = descriptor[key];
      const sourceItem = target && target[key];
      const own = target && hasProp.call(target, key);
      const deep =
        isObject(sourceItem) ||
        isArray(sourceItem) ||
        (descriptorItem &&
          descriptorItem.fields &&
          (descriptorItem.type === 'array' ||
            descriptorItem.type === 'object'));
      const nextPaths = paths.concat(isIndex(key) ? `[${key}]` : key);
      const fullField = nextPaths.join('.').replace(/\.\[/g, '[');
      const rules = isArray(descriptorItem) ? descriptorItem : [descriptorItem];
      const ruleLen = rules.length;
      for (let i = 0; i < ruleLen; i++) {
        const { fields, label, defaultField, ...rule } = rules[
          i
        ] as FieldRule & { fields?: Descriptor };
        const ruleKeys = Object.keys(rule);
        const ruleKeysLen = ruleKeys.length;
        if (deep && (fields || defaultField)) {
          if (fields) {
            this.tranverseValidate(
              sourceItem,
              fields,
              nextPaths,
              options,
              middlewares,
              validateCallback,
              source,
            );
          } else if (defaultField) {
            const defaultFields: { [prop: string]: FieldRule } = {};
            for (const k in sourceItem) {
              defaultFields[k] = defaultField;
            }
            this.tranverseValidate(
              sourceItem,
              defaultFields,
              nextPaths,
              options,
              middlewares,
              validateCallback,
              source,
            );
          }
        } else if ((own || rule.required) && ruleKeysLen > 0) {
          for (let j = 0; j < ruleKeysLen; j++) {
            const ruleType = ruleKeys[j];
            const validateMethod = this.getValidateMethod(rule, ruleKeys[j]);
            if (validateMethod) {
              middlewares.push(next => errors => {
                const len = errors.length;
                if (
                  options.first &&
                  len > 0 &&
                  errors[len - 1].field === fullField
                ) {
                  return next(errors);
                }
                if (
                  rule.trigger &&
                  !options.force &&
                  options.trigger !== rule.trigger
                ) {
                  return next(errors);
                }
                validateMethod(
                  sourceItem,
                  error => {
                    if (error) {
                      error.ruleType = ruleType as any;
                      errors.push(error);
                      if (
                        options.firstField === true ||
                        options.firstField === fullField
                      ) {
                        validateCallback(errors);
                        return;
                      }
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
    target: any,
    options: ValidateOptions = {},
    callback: (errors: FieldError[]) => void,
    source?: any,
  ) {
    const {
      fullField = '',
      firstField = false,
      first = true,
      trigger = '',
      force = true,
    } = options;
    let { descriptor } = this;
    if (fullField) {
      const descriptorItem = get(
        descriptor,
        fullField
          .replace(/\[/g, '.')
          .replace(/\]/g, '')
          .split('.')
          .join('.fields.'),
      );
      if (!descriptorItem) {
        return callback([]);
      }
      descriptor = {
        [fullField]: descriptorItem,
      };
      target = { [fullField]: target };
    }
    const validateCallback = (errors: FieldError[]) => {
      callback(errors);
    };
    const middlewares: ValidateMiddleware[] = [];
    this.tranverseValidate(
      target,
      descriptor,
      [],
      { fullField, firstField, first, trigger, force },
      middlewares,
      validateCallback,
      source,
    );
    const dispatch = compose(middlewares)(validateCallback);
    dispatch([]);
  }
}

export default Xvalidator;
