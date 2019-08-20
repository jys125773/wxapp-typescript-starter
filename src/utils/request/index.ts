import Request from './request';
import { checkStatus, checkAuth } from './middlewares';

const request = new Request({
  middlewares: {
    request: [checkAuth],
    response: [checkStatus],
    error: [],
  },
});

export default request;
