
const fetchSomething = (c) => new Promise((resolve) => {
  setTimeout(() => resolve('future value' + c), 500);
});

const promiseFunc = (i) => new Promise((resolve) => {
  fetchSomething('M').then(result => {
    resolve(result + i);
  });
});

promiseFunc(2).then(res => console.log(res));