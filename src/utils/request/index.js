import Request from './request';
import { checkAuth } from './middlewares';

const request = new Request({
  middlewares: {
    request: [checkAuth],
  },
});

export default request;
