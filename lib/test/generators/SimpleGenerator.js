function* numbers () {
  let i = 0;
  yield ++i;
  yield ++i;
  return ++i;
  yield ++i;
};

var g = numbers();
console.log(g.next());
// <- { done: false, value: 1 }
console.log(g.next());
// <- { done: false, value: 2 }
console.log(g.next());
// <- { done: true, value: 3 }