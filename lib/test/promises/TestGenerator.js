let log = console.log.bind(console);
let err = console.error.bind(console);

function coroutine(generatorFn){
  return function co(...args) {
    let generator = generatorFn(...args)

    function handle(result) {
      console.log(result);
      if (result.done) {
        return Promise.resolve(result.value);
      }
      return Promise.resolve(result.value)
        .then(
          res => handle(generator.next(res)),
          err => handle(generator.throw(err))
        );
    }

    try {
      return handle(generator.next());
    } catch (err) {
      return Promise.reject(err);
    }
  };
}

function sleep(dur) {
  return new Promise(res => {
    setTimeout(() => { res() }, dur);
  });
}

function* recurse(limit = 5, count = 0) {  
  if(count < limit) {
    yield sleep(100);
    return yield* recurse(limit, count + 1);
  }
  else {
    return count;
  }
}

let test = coroutine(recurse);

test().then(log).catch(err);