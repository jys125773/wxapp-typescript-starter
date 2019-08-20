import { TRequestMiddleware } from './types';

export const checkStatus: TRequestMiddleware = (ctx, next) => {
  if (ctx.res) {
    const { statusCode } = ctx.res;
    if ((statusCode < 200 || statusCode >= 300) && statusCode !== 304) {
      return Promise.reject({
        statusCode,
        errMsg: `request:fail invalid statusCode:${statusCode}`,
      });
    }
  }
  return next();
};

export const checkAuth = (function() {
  let authed = false,
    authing = false,
    authQueue: (() => void)[] = [];

  const inner: TRequestMiddleware = async (_ctx, next) => {
    if (authed) {
      return next();
    }
    if (authing) {
      await new Promise(resolve => authQueue.push(resolve));
      return next();
    }
    authing = true;
    try {
      //模拟异步授权
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 5000);
      });
      authed = true;
      authing = false;
      while (authQueue.length) {
        const task = authQueue.shift();
        task && task();
      }
      return next();
    } catch (error) {
      authed = false;
      authing = false;
      authQueue = [];
      return Promise.reject(error);
    }
  };
  return inner;
})();
