type TWxRequestOptions = {
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

type TRequestMiddleware = (ctx: any, next: () => void) => void;

type TRequestInitOptions = {
  middlewares?: {
    request?: TRequestMiddleware[];
    response?: TRequestMiddleware[];
    error?: TRequestMiddleware[];
  };
};

type TRequestConfig = {
  task?: wx.RequestTask;
  [key: string]: any;
};

type TRequestContext = {
  req: { url: string; options: TWxRequestOptions };
  config: IAnyObject;
  res?: wx.RequestSuccessCallbackResult;
  error?: Error | { errMsg: string };
};

class MiddlewareManager {
  private middlewares: TRequestMiddleware[] = [];
  constructor(middlewares: TRequestMiddleware[] = []) {
    this.middlewares = middlewares;
  }
  public use(middleware: TRequestMiddleware) {
    this.middlewares.push(middleware);
  }
  public eject(middleware: TRequestMiddleware) {
    const index = this.middlewares.findIndex(i => i === middleware);
    if (index !== -1) {
      this.middlewares.splice(index, 1);
    }
  }
  public excute(ctx: any) {
    const { middlewares } = this;
    if (middlewares.length === 0) {
      return Promise.resolve();
    }
    let index = -1;
    function dispatch(i: number) {
      if (i <= index) {
        return Promise.reject(new Error('next() called multiple times'));
      }
      index = i;
      const middleware = middlewares[i];
      if (typeof middleware !== 'function') {
        return Promise.resolve();
      }
      try {
        return Promise.resolve(middleware(ctx, () => dispatch(i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return dispatch(0);
  }
}

class Request {
  public middlewares: {
    request: MiddlewareManager;
    response: MiddlewareManager;
    error: MiddlewareManager;
  };

  constructor(options: TRequestInitOptions) {
    const { middlewares } = options;
    this.middlewares = {
      request: new MiddlewareManager(middlewares && middlewares.request),
      response: new MiddlewareManager(middlewares && middlewares.response),
      error: new MiddlewareManager(middlewares && middlewares.error),
    };
  }

  public http(
    url: string,
    options: TWxRequestOptions,
    config: TRequestConfig = {},
  ) {
    const { middlewares } = this;
    const ctx: TRequestContext = {
      req: { options, url },
      config,
    };
    return new Promise((resolve, reject) => {
      function processError(error: Error | { errMsg: string }) {
        ctx.error = error;
        middlewares.error
          .excute(ctx)
          .then(() => {
            reject(ctx.error);
          })
          .catch(error => {
            reject(error);
          });
      }
      middlewares.request
        .excute(ctx)
        .then(() => {
          const {
            req: { url, options },
          } = ctx;
          config.task = wx.request({
            url,
            ...options,
            success: response => {
              ctx.res = response;
              middlewares.response
                .excute(ctx)
                .then(() => {
                  resolve(ctx.res);
                })
                .catch(processError);
            },
            fail: processError,
          });
        })
        .catch(processError);
    });
  }
}
