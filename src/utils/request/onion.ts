import { TRequestMiddleware } from './types';

class Onion {
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

export default Onion;
