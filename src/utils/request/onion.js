import { compose } from '../util';

class Onion {
  middlewares = [];
  constructor(middlewares = []) {
    this.middlewares = middlewares;
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  eject(middleware) {
    const index = this.middlewares.findIndex(mw => mw === middleware);
    if (index !== -1) {
      this.middlewares.splice(index, 1);
    }
  }
  excute(ctx) {
    return new Promise((resolve, reject) => {
      const chain = this.middlewares.map(mw => mw(reject));
      const dispatch = compose(chain)(resolve);
      dispatch(ctx);
    });
  }
}

export default Onion;
