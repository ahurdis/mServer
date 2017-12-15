var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};

for (let x of [...myIterable]){
    console.log(x);
}; // [1, 2, 3]