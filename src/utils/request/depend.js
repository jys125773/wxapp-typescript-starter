function depend(task) {
  const queue = [];
  let done = false;
  let pending = false;
  return suspend => next => ctx => {
    if (done) {
      return next(ctx);
    }
    if (pending) {
      return queue.push(() => next(ctx));
    }
    pending = true;
    queue.push(() => next(ctx));
    task()
      .then(() => {
        pending = false;
        done = true;
        while (queue.length) {
          const task = queue.shift();
          task && task();
        }
      })
      .catch(e => {
        suspend(e);
        pending = false;
      });
  };
}

export default depend;
