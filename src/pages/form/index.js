import createForm from '../../components/form/createForm';

Page({
  data: {
    ordinaryFormData: {
      account: '',
      password: '',
      comfirmPassword: '',
    },
    ordinaryFormRules: {
      account: [
        { required: true },
        { pattern: 'abc', message: '账号必须包含“abc”' },
        { min: 4 },
      ],
      password: [
        { required: true },
        {
          pattern: '^(\\w){6,20}$',
          message: '只能输入6-20个字母、数字、下划线',
        },
      ],
      comfirmPassword: [{ required: true }, { equalTo: 'password' }],
    },

    customFormData: {
      name: '',
      region: '',
      // date: ['2019-12-25', '2019-12-31'],
      date: [],
      delivery: false,
      type: [],
      resource: '',
      desc: '',
    },
    customFormErrors: {},
  },
  onReady() {
    this.ordinaryForm = createForm({
      selector: '#ordinary-form',
      initialFields: this.data.ordinaryFormData,
    });
    this.customForm = createForm({
      selector: '#custom-form',
      initialFields: this.data.customFormData,
      descriptor: {
        name: [
          { required: true },
          { min: 4 },
          { max: 10 },
          {
            pattern: /^[\u0391-\uFFE5A-Za-z\s]+$/,
            message: '活动名称必须由中文和英文字母组成',
          },
          {
            validator: (value, callback) => {
              console.log('name validator excute');

              setTimeout(() => {
                if (Math.random() > 0.7) {
                  callback({
                    message: '活动名称已经存在',
                  });
                } else {
                  callback();
                }
              }, 500);
            },
            trigger: 'blur',
          },
        ],
        region: [{ required: true }, { max: 10 }],
        date: {
          type: 'array',
          fields: {
            0: [
              { required: true },
              {
                validator: (value, callback, options, rule, source) => {
                  const endDateStr = source && source.date && source.date[1];
                  if (value && endDateStr) {
                    if (
                      new Date(endDateStr).valueOf() <=
                      new Date(value).valueOf()
                    ) {
                      return callback({
                        message: '活动开始时间不能早于结束时间',
                        // fullField: options.fullField,
                        // ruleType: 'validator',
                      });
                    }
                  }
                  callback();
                },
              },
            ],
            1: [
              { required: true },
              {
                validator: (value, callback, options, rule, source) => {
                  const startDateStr = source && source.date && source.date[0];
                  if (value && startDateStr) {
                    if (
                      new Date(startDateStr).valueOf() >=
                      new Date(value).valueOf()
                    ) {
                      return callback({
                        message: '活动结束时间不能晚于活动开始时间',
                        // fullField: options.fullField,
                        // ruleType: 'validator',
                      });
                    }
                  }
                  callback();
                },
              },
            ],
          },
        },
        type: [
          { required: true },
          { range: [1, 3], message: '活动性质只能选择1-3个' },
        ],
        desc: [
          { required: true },
          { max: 20, message: '活动内容文本不能超过20个字符' },
        ],
      },
    });
  },
  onOrdinaryFormPassordBlur() {
    if (this.ordinaryForm.isFieldTouched('comfirmPassword')) {
      this.ordinaryForm.validateSingleField('comfirmPassword');
    }
  },
  onOrdinaryFormFieldChange(e) {
    this.ordinaryForm.onFieldChange(e, formData => {
      this.setData({ ordinaryFormData: formData });
    });
  },
  onOrdinaryFormSubmit() {
    this.ordinaryForm.validate((isValid, errors) => {
      console.log(isValid, errors);
    });
  },
  onOrdinaryFormReset() {
    this.ordinaryForm.reset(formData => {
      this.setData({ ordinaryFormData: formData });
    });
  },
  onCustomFormFieldChange(e) {
    const { prop } = e.target.dataset;
    this.customForm.onFieldChange(e, (formData, isValid, errors) => {
      console.log('formData', formData);

      this.setData({ customFormData: formData });
      const { customFormErrors } = this.data;
      if (errors.length === 0) {
        customFormErrors[prop] = null;
      } else {
        customFormErrors[prop] = errors[0].message;
      }
      this.setData({ customFormErrors });
    });
  },
  onCustomFormFormSubmit() {
    this.customForm.validate((isValid, errors) => {
      if (!isValid) {
        const customFormErrors = {};
        errors.forEach(({ field, message }) => {
          customFormErrors[field] = message;
        });
        this.setData({ customFormErrors });
      }
    });
  },
  onCustomFormFormReset() {
    this.customForm.reset(formData => {
      this.setData({ customFormData: formData, customFormErrors: {} });
    });
  },
  onCustomFormFormPartSubmit() {
    this.customForm.validateField(['date', 'region'], (isValid, errors) => {
      if (!isValid) {
        const customFormErrors = { ...this.data.customFormErrors };
        errors.forEach(({ field, message }) => {
          customFormErrors[field] = message;
        });
        this.setData({ customFormErrors });
      }
    });
  },
});
