import Storage from '../storage';
import Onion from './onion';
import {
  TWxRequestOptions,
  TRequestConfig,
  TRequestContext,
  TRequestInitOptions,
} from './types';

class Request {
  public middlewares: {
    request: Onion;
    response: Onion;
    error: Onion;
  };

  public cache = new Storage();

  constructor(options: TRequestInitOptions) {
    const { middlewares } = options;
    this.middlewares = {
      request: new Onion(middlewares && middlewares.request),
      response: new Onion(middlewares && middlewares.response),
      error: new Onion(middlewares && middlewares.error),
    };
  }

  public get(url: string, options: TWxRequestOptions, config?: TRequestConfig) {
    return this.http(url, { ...options, method: 'GET' }, config);
  }

  public post(
    url: string,
    options: TWxRequestOptions,
    config?: TRequestConfig,
  ) {
    return this.http(url, { ...options, method: 'POST' }, config);
  }

  public put(url: string, options: TWxRequestOptions, config?: TRequestConfig) {
    return this.http(url, { ...options, method: 'PUT' }, config);
  }

  public http(
    url: string,
    options: TWxRequestOptions,
    config: TRequestConfig = {},
  ) {
    const { middlewares, cache } = this;
    const { expiration } = config;
    const useCache = typeof expiration === 'number' && expiration >= 0;
    const ctx: TRequestContext = {
      req: { options, url },
      config,
      cache,
    };
    return new Promise((resolve, reject) => {
      const processError = (error: Error | { errMsg: string }) => {
        ctx.error = error;
        return middlewares.error
          .excute(ctx)
          .then(() => {
            reject(ctx.error);
          })
          .catch(error => {
            reject(error);
          });
      };
      const processResponse = (response: wx.RequestSuccessCallbackResult) => {
        ctx.res = response;
        return middlewares.response
          .excute(ctx)
          .then(() => {
            if (useCache) {
              try {
                this.cache.set(url, ctx.res, expiration);
              } catch (error) {}
            }
            resolve(ctx.res);
          })
          .catch(processError);
      };
      middlewares.request
        .excute(ctx)
        .then(() => {
          const {
            req: { url, options },
          } = ctx;
          let response: wx.RequestSuccessCallbackResult | undefined;
          if (useCache) {
            try {
              response = this.cache.get(url);
            } catch (error) {}
          }
          if (response) {
            return processResponse(response);
          }
          ctx.config.task = wx.request({
            url,
            ...options,
            success: processResponse,
            fail: processError,
          });
        })
        .catch(processError);
    });
  }
}

export default Request;
