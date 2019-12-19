function throttle(delay, noTrailing, callback, debounceMode) {
  let timeoutID;
  let cancelled = false;
  let lastExec = 0;
  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  }
  function cancel() {
    clearExistingTimeout();
    cancelled = true;
  }
  if (typeof noTrailing !== 'boolean') {
    debounceMode = callback;
    callback = noTrailing;
    noTrailing = undefined;
  }
  function wrapper() {
    const self = this;
    const elapsed = Date.now() - lastExec;
    const args = arguments;
    if (cancelled) {
      return;
    }
    function exec() {
      lastExec = Date.now();
      callback.apply(self, args);
    }
    function clear() {
      timeoutID = undefined;
    }
    if (debounceMode && !timeoutID) {
      exec();
    }
    clearExistingTimeout();
    if (debounceMode === undefined && elapsed > delay) {
      exec();
    } else if (noTrailing !== true) {
      timeoutID = setTimeout(
        debounceMode ? clear : exec,
        debounceMode === undefined ? delay - elapsed : delay,
      );
    }
  }
  wrapper.cancel = cancel;
  return wrapper;
}

function debounce(delay, atBegin, callback) {
  return callback === undefined
    ? throttle(delay, atBegin, false)
    : throttle(delay, callback, atBegin !== false);
}

export { throttle, debounce };
