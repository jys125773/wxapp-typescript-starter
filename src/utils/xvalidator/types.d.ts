export type RuleType =
  | 'type'
  | 'required'
  | 'enum'
  | 'equal'
  | 'equalTo'
  | 'whitespace'
  | 'pattern'
  | 'len'
  | 'min'
  | 'max'
  | 'range'
  | 'validator';

export interface ValidateOptions {
  fullField?: string;
  firstField?: string | boolean;
  first?: boolean;
  trigger?: string;
  force?: boolean;
}

export interface FieldError {
  field: string;
  message: string;
  ruleType?: RuleType;
}

export type ValidateMiddleware = (
  next: (errors: FieldError[]) => void,
) => (errors: FieldError[]) => void;

export interface ValidateMethodOptions {
  field: string;
  fullField: string;
  label?: string;
}

export interface FieldRule {
  label?: string;
  message?: string;
  required?: boolean;
  enum?: any[];
  equal?: any;
  equalTo?: string;
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
  defaultField?: FieldRule;
  validator?: ValidateMethod;
  trigger?: string;
}

export type ValidateMethod = (
  value: any,
  callback: (error?: FieldError) => void,
  options: ValidateMethodOptions,
  rule: FieldRule,
  source: any,
) => void;

export interface ValidateOptions {
  fullField?: string;
  firstField?: string | boolean;
  first?: boolean;
  trigger?: string;
  force?: boolean;
}

export interface Rules {
  required: ValidateMethod;
  whitespace: ValidateMethod;
  enum: ValidateMethod;
  equal: ValidateMethod;
  equalTo: ValidateMethod;
  pattern: ValidateMethod;
  range: ValidateMethod;
  type: ValidateMethod;
}

export interface Descriptor {
  [prop: string]:
    | (FieldRule & { fields?: Descriptor })
    | (FieldRule & { fields?: Descriptor })[];
}
