import set from 'lodash.set';
import { debounce } from '../../utils/throttle-debounce';
import { isObject, isArray, isString, get } from '../../utils/util';
import Validator from '../../utils/validator';
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
        this.descendants.push(target);
        this.setValidator();
      },
      unlinked(target) {
        this.descendants = this.descendants.filter(child => child !== target);
        this.setValidator();
      },
    },
  },
  created() {
    this.formData = {};
    this.descendants = [];
    this.setValidator = debounce(10, () => {
      const descriptor: any = {};
      this.descendants.forEach(item => {
        const { prop, rules, label } = item.data;
        setDescriptorItem(
          descriptor,
          prop,
          isObject(rules) ? [rules] : rules,
          label,
        );
      });
      this.validator = new Validator(descriptor);
      console.log('descriptor', descriptor);
    });
  },
  data: {},
  methods: {
    onFeildChange(event) {
      const {
        type,
        target: {
          dataset,
          dataset: { prop },
        },
        detail,
      } = event;
      const formItem = this.descendants.find(d => d.data.prop === prop);
      const valuePropName = formItem
        ? formItem.data.valuePropName
        : dataset.valuePropName || 'value';
      const trigger = formItem
        ? formItem.data.trigger
        : dataset.trigger || 'change';
      if (isString(valuePropName) && isString(prop)) {
        const value = detail[valuePropName];
        set(this.formData, prop, value);
        if (shouldTrigger(type, trigger)) {
          this.validateField(prop);
        }
        console.log(this.formData);
      }
    },
    create() {},
    validate() {},
    validateField(prop: string) {
      const value = get(this.formData, prop);
      console.log('prop', prop);

      this.validator.validate(
        value,
        { fullField: prop, firstField: true },
        errors => {
          console.log(errors);
        },
      );
    },
    resetFields() {},
    clearValidate() {},
  },
});
