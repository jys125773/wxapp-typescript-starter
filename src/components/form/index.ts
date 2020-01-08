import { debounce, throttle } from 'throttle-debounce';
import deepClone from 'clonedeeply';
import Validator from '../../utils/xvalidator/index';
import { Descriptor as TDescriptor } from '../../utils/xvalidator/types';
import {
  isObject,
  isArray,
  isString,
  isNumber,
  get,
  set,
} from '../../utils/util';
import { setDescriptorItem } from './util';

function shouldTrigger(eventType: string, trigger: string | string[]) {
  return (
    (isString(trigger) && eventType === trigger) ||
    (isArray(trigger) && trigger.indexOf(eventType) !== -1)
  );
}

Component({
  relations: {
    '../form-item/index': {
      type: 'descendant',
      linked(target) {
        const { prop } = target.data;
        if (isString(prop)) {
          this.descendants[prop] = target;
          this.updateValidator();
        }
      },
      unlinked(target) {
        const { prop } = target.data;
        if (isString(prop)) {
          delete this.descendants[prop];
          this.updateValidator();
        }
      },
    },
  },
  created() {
    this.initialFieldsData = {};
    this.fieldsData = {};
    this.fieldsTouched = {};
    this.descendants = {};
    this.updateValidator = debounce(10, this.updateValidator);
  },
  data: {},
  methods: {
    create(options: {
      initialFields: Record<string, any>;
      descriptor?: TDescriptor;
      throttle?: number;
    }) {
      const {
        initialFields = {},
        descriptor,
        throttle: throttleTime = 50,
      } = options;
      this.initialFieldsData = deepClone(initialFields);
      this.fieldsData = deepClone(initialFields);
      if (descriptor) {
        this.validator = new Validator(descriptor);
      }
      //@ts-ignore
      if (isNumber(throttleTime) && throttleTime > 0) {
        this.onFieldChange = throttle(throttleTime, this.onFieldChange);
      }
    },
    onFieldChange(event, callback?: Function) {
      const {
        type,
        target: {
          dataset,
          dataset: { prop },
        },
        detail,
      } = event;
      const formItem = this.descendants[prop];
      const valuePropName = formItem
        ? formItem.data.valuePropName
        : dataset.valuePropName || 'value';
      const trigger = formItem
        ? formItem.data.trigger
        : dataset.trigger || 'change';
      if (isString(valuePropName) && isString(prop)) {
        this.fieldsTouched[prop] = true;
        const value = detail[valuePropName];
        set(this.fieldsData, prop, value);
        if (formItem) {
          formItem.setDirty();
        }
        if (shouldTrigger(type, trigger)) {
          this.validateSingleField(
            prop,
            (isValid, errors) => {
              if (callback) {
                callback(this.fieldsData, isValid, errors);
              }
            },
            type,
          );
        } else if (callback) {
          callback(this.fieldsData);
        }
      }
    },
    validate(callback?: Function) {
      this.validateBranchField('', callback);
    },
    validateField(props: string | string[], callback?: Function) {
      if (isArray(props)) {
        const len = props.length;
        let isAllValid = true;
        let allErrors = [];
        let count = 0;
        //@ts-ignore
        props.forEach(prop => {
          this.validateBranchField(prop, (isValid, errors) => {
            count++;
            if (!isValid) {
              isAllValid = false;
            }
            allErrors = allErrors.concat(errors);
            if (len === count && callback) {
              callback(isAllValid, allErrors);
            }
          });
        });
        return;
      }
      this.validateBranchField(props, callback);
    },
    validateBranchField(prop = '', callback?: Function) {
      const errorsMap: any = {};
      this.validator.validate(
        prop ? get(this.fieldsData, prop) : this.fieldsData,
        { fullField: prop, firstField: false },
        errors => {
          errors.forEach(error => {
            const { field } = error;
            if (!errorsMap[field]) {
              errorsMap[field] = error;
            }
          });
          this.formItemsForEach((formItem, propKey) => {
            const error = errorsMap[propKey];
            if (error) {
              formItem.setValidate(error.message);
            } else {
              errorsMap[propKey] = null;
              formItem.clearValidate();
            }
          }, prop);
          if (callback) {
            const isValid = errors.length === 0;
            callback(isValid, errors);
          }
        },
        this.fieldsData,
      );
    },
    validateSingleField(prop: string, callback?: Function, trigger?: string) {
      this.validator.validate(
        get(this.fieldsData, prop),
        { trigger, fullField: prop, firstField: true, force: false },
        errors => {
          const isValid = errors.length === 0;
          if (callback) {
            callback(isValid, errors);
          }
          const formItem = this.descendants[prop];
          if (formItem) {
            if (isValid) {
              formItem.clearValidate();
            } else {
              formItem.setValidate(errors[0].message);
            }
          }
        },
        this.fieldsData,
      );
    },
    reset(callback?: Function) {
      this.resetBranchField('', callback);
    },
    resetField(props: string | string[], callback?: Function) {
      if (isArray(props)) {
        //@ts-ignore
        props.forEach(prop => {
          this.resetBranchField(prop);
        });
        if (callback) {
          callback(this.fieldsData);
        }
        return;
      }
      this.resetBranchField(props, callback);
    },
    resetBranchField(prop = '', callback?: Function) {
      if (prop) {
        set(
          this.fieldsData,
          prop,
          deepClone(get(this.initialFieldsData, prop)),
        );
      } else {
        this.fieldsData = deepClone(this.initialFieldsData);
      }
      if (callback) {
        callback(this.fieldsData);
      }
      Object.keys(this.fieldsTouched).forEach(touchedProp => {
        if (touchedProp.indexOf(prop)) {
          delete this.fieldsTouched[touchedProp];
        }
      });
      this.formItemsForEach(formItem => {
        formItem.resetField();
      }, prop);
    },
    clearValidate(props: string | string[] = '') {
      if (typeof props === 'string') {
        props = [props];
        props.forEach(prop => {
          this.formItemsForEach(formItem => {
            formItem.clearValidate();
          }, prop);
        });
      }
    },
    isFieldTouched(props: string | string[]) {
      if (typeof props === 'string') {
        return this.fieldsTouched[props];
      }
      return props.some(item => this.fieldsTouched[item]);
    },
    formItemsForEach(callback: Function, propPrefix = '') {
      const { descendants } = this;
      Object.keys(descendants).forEach(prop => {
        if (prop.indexOf(propPrefix) === 0) {
          callback(descendants[prop], prop);
        }
      });
    },
    updateValidator() {
      const descriptor: any = {};
      this.formItemsForEach(formItem => {
        const { prop, rules, label } = formItem.data;
        setDescriptorItem(
          descriptor,
          prop,
          isObject(rules) ? [rules] : isArray(rules) ? rules : [],
          label,
        );
      });
      this.validator = new Validator(descriptor);
    },
  },
});
