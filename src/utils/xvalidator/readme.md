# xvalidator
---

## 插件介绍
xvalidator是一个可扩展的支持json嵌套与异步验证的js表单验证工具类，提供了业务中常用的验证规则，可与任何前端框架绑定，也可以在nodejs中使用，让表单验证变得规范与简单。

## 使用
  ```js
  import Xvalidator from './lib/index';

  const validator = new Xvalidator({
    email: [
      {
        required: true,
        type: 'email',
        enum: ['1@163.com', '2@qq.com'],
      },
      {
        validator: (value, callback, options) => {
          setTimeout(() => {
            if (Math.random() > 0.5) {
              callback({
                message: `${value}已经被使用`,
                ruleType: 'validator',
                field: options.fullField,
              })
            } else {
              callback();
            }
          }, 1000);
        },
        trigger: 'blur',
      }
    ],
    password: [
      { required: true },
      { pattern: /^(\w){6,20}$/, message: 'password只能输入6-20个字母、数字、下划线' },
    ],
    confirmPassword: { required: true, equalTo: 'password' },
    phones: {
      required: true,
      type: 'array',
      defaultField: { type: 'mobile' }
    },
    user: {
      type: 'object',
      fields: {
        name: { required: true, type: 'string' },
        age: { required: true, type: 'number' },
      }
    }
  });

  validator.validate({
    email: 'email string',
    password: '123456',
    confirmPassword: '123456',
    phones: ['13718259540', 'dd']
  }, { first: false }, errors => {
    console.log(errors);
  });

  validator.validate({
    email: '1@163.com',
  }, { trigger: 'blur' }, errors => {
    console.log(errors);
  });

  validator.validate('13718259540', { fullField: 'phones[0]' }, errors => {
    console.log(errors);
  });

  validator.validate(123, { fullField: 'user.name' }, errors => {
    console.log(errors);
  });
  ```

### Validate
```javascript
 function(source, options, callback): void
```
* `source`: 需要验证的json对象或者其某一部分
* `options`: 验证配置选项
* `callback`: 验证结束之后的回调函数

### Options
* `fullField`: String, 需要验证的json对象的某一部分路径，默认为'',代表整个json
* `firstField`: String | Boolean, 验证到jsond对象某部分一旦出现错误，就停止后续规则的验证并且执行callback回调，默认为false，如果为true代表验证到第一个错误就停止
* `first`: Boolean, 验证到某个表单域规则的第一个错误就越过其后续规则的验证，停止验证或者跳跃执行后续验证，默认为true
* `trigger`: String，如果trigger是字符串并且与rule的trigger相等，才执行此rule的验证，默认为''
* `force`: Boolean， 无视trigger的存在，强制验证rule

### Rules
Rules是执行验证的函数的集合
```javascript
 function(value, callback, options, rule, source)
```
* `value`: Any, source对象的某个需要验证的属性值
* `callback`: Function, 一个验证规则执行完毕之后的回调函数
* `options`: Object, 额外的选项信息
* `rule`: Object, 一个验证规则的描述对象
* `source`: Object，source对象

#### Type
* `string`: 必须是字符串类型
* `array`: 必须是数组类型
* `number`: 必须是数字类型
* `date`: 必须是日期类型
* `boolean`: 必须是布尔值
* `regexp`: 必须是正则表达式
* `integer`: 必须是整数
* `float`: 必须是浮点数
* `email`: 必须是电子邮箱
* `mobile`: 必须是手机号

### Required
表示属性值不能是undefined，空数组，空字符串中的任何一种情况

### Enum
表示属性值必须是enum数组枚举值的其中一项

### Equal
表示属性值必须等于equal

### EqualTo
表示属性值必须等于source上的equalTo属性

### Whitespace
表示属性值前后不能存在空格

### Pattern
表示属性值必须匹配pattern正则表达式

### Len
表示属性值的长度必须等于len

### Min
表示属性值的长度不能小于min

### Max
表示属性值的长度不能大于max

### Range
表示属性值的长度不能小于range[0],不能大于range[1]

### Validator
自定义验证规则