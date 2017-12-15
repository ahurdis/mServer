
const isPromise = (obj) => typeof obj !== 'undefined' &&
  typeof obj.then === 'function';

const next = (iter, callback, prev = undefined) => {
  const item = iter.next(prev);
  const value = item.value;

  if (item.done) return callback(prev);

  if (isPromise(value)) {
    value.then(val => {
      setImmediate(() => next(iter, callback, val));
    });
  } else {
    setImmediate(() => next(iter, callback, value));
  }
};

const gensync = (fn) =>
    (...args) => new Promise(resolve => {
  next(fn(...args), val => resolve(val));
});



/* How to use gensync() */

const fetchSomething = () => new Promise((resolve) => {
  setTimeout(() => resolve('future value'), 500);
});

const asyncFunc = gensync(function* () {
  const result = yield fetchSomething(); // returns promise

  // waits for promise and uses promise result
  yield result + ' 2';
});

// Call the async function and pass params.
asyncFunc('param1', 'param2', 'param3')
  .then(val => console.log(val)); // 'future value 2'