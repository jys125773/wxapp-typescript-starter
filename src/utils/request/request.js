import Storage from '../storage';
import Onion from './onion';
import { merge, isNumer } from '../util';

class Request {
  middlewares = {
    request: [],
    response: [],
    fail: [],
  };
  cache = new Storage();
  defaultOptions = {
    data: {},
    dataType: 'json',
    responseType: 'text',
    header: {},
  };
  constructor(options) {
    const { middlewares, ...initOptions } = options;
    this.middlewares = {
      request: new Onion(middlewares && middlewares.request),
      response: new Onion(middlewares && middlewares.response),
      fail: new Onion(middlewares && middlewares.fail),
    };
    this.defaultOptions = merge(this.defaultOptions, initOptions);
  }
  get(url, options = {}, config) {
    return this.http(url, { ...options, method: 'GET' }, config);
  }
  post(url, options = {}, config) {
    return this.http(url, { ...options, method: 'POST' }, config);
  }
  put(url, options = {}, config) {
    return this.http(url, { ...options, method: 'PUT' }, config);
  }
  http(url, options, config = {}) {
    const { middlewares, cache } = this;
    const { expiration } = config;
    const useCache = isNumer(expiration) && expiration >= 0;
    const ctx = {
      req: { url, options: merge(this.defaultOptions, options) },
      config,
      cache,
    };
    return new Promise((resolve, reject) => {
      function processReject(ctx) {
        middlewares.fail
          .excute(ctx)
          .then(ctx => {
            reject(ctx.error);
          })
          .catch(e => {
            reject(e);
          });
      }
      function cather(e) {
        ctx.error = e;
        processReject(ctx);
      }
      function processResolve(ctx) {
        middlewares.response
          .excute(ctx)
          .then(ctx => {
            resolve(ctx.response);
          })
          .catch(cather);
      }
      middlewares.request
        .excute(ctx)
        .then(ctx => {
          const {
            req: { url, options },
          } = ctx;
          ctx.config.task = wx.request({
            url,
            ...options,
            success: res => {
              ctx.response = res;
              processResolve(ctx);
            },
            fail: cather,
          });
        })
        .catch(cather);
    });
  }
}

export default Request;
