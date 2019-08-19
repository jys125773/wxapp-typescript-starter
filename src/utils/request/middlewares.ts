import { TRequestMiddleware } from './types';
export const checkStatus: TRequestMiddleware = (ctx, next) => {
  if (!ctx.res) {
    return next();
  }
  const { statusCode } = ctx.res;
  if ((statusCode < 200 || statusCode >= 300) && statusCode !== 304) {
    return Promise.reject({
      statusCode,
      errMsg: `request:fail invalid statusCode:${statusCode}`,
    });
  }
};
