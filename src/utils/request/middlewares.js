import depend from './depend';

const auth = () =>
  new Promise((resolve, rejct) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve(true);
      } else {
        rejct(new Error('授权失败'));
      }
    }, 1000);
  });

export const checkAuth = depend(auth);
