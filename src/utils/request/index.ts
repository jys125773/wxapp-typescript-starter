import Request from './request';
import { checkStatus } from './middlewares';

const request = new Request({
  middlewares: {
    request: [],
    response: [checkStatus],
    error: [],
  },
});

export default request;
