declare function requirePlugin(pluginName: string): any;

declare function require(pluginName: string): any;

declare type NonNullable<T> = T extends null | undefined ? never : T;

declare type Exclude<T, U> = T extends U ? never : T;

declare type Required<T> = {
  [P in keyof T]-?: T[P];
};

declare type InstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer R
  ? R
  : any;

declare type IAnyObject = Record<string, any>;

declare type KVInfer<T> = {
  [K in keyof T]: T[K];
};

declare type Void<T> = T | undefined | null;

declare type PartialOptional<T, K extends keyof T> = Partial<Pick<T, K>> &
  Pick<T, Exclude<keyof T, K>>;

declare type Optional<T> = {
  [K in keyof T]+?: T[K];
};
