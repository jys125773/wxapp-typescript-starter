import Storage from '../storage';

export type TWxRequestOptions = {
  data?: string | object | ArrayBuffer;
  dataType?: 'json' | '其他';
  header?: object;
  method?:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT';
  responseType?: 'text' | 'arraybuffer';
};

export type TRequestConfig = {
  task?: wx.RequestTask;
  expiration?: number;
  [key: string]: any;
};

export type TRequestContext = {
  req: { url: string; options: TWxRequestOptions };
  config: TRequestConfig;
  cache: Storage;
  res?: wx.RequestSuccessCallbackResult;
  error?: Error | { errMsg: string };
};

export type TRequestMiddleware = (
  ctx: TRequestContext,
  next: () => void,
) => void;

export type TRequestInitOptions = {
  middlewares?: {
    request?: TRequestMiddleware[];
    response?: TRequestMiddleware[];
    error?: TRequestMiddleware[];
  };
};
