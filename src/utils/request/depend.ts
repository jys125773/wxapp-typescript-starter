function dependTask(mainTask, asyncTask) {
  let taskQueue: (() => void)[] = [];
  let completed = false;
  let pending = false;
  return function(this: any) {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const ctx = this;
    if (completed) {
      return mainTask.apply(ctx, args);
    } else if (pending) {
      return new Promise((resolve, reject) => {
        taskQueue.push(() => {
          mainTask
            .apply(ctx, args)
            .then(resolve)
            .catch(reject);
        });
      });
    }
    pending = true;
    return asyncTask()
      .then(() => {
        pending = false;
        completed = true;
        const promise = mainTask.apply(ctx, args);
        while (taskQueue.length) {
          const task = taskQueue.shift();
          task && task();
        }
        return promise;
      })
      .catch(() => {
        taskQueue = [];
        pending = false;
        completed = true;
      });
  };
}

export default dependTask;
