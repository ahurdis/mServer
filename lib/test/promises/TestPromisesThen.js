var Promises = require('bluebird');

function increment(x) {
    console.log('inc ' + x);
    return Promise.resolve(x + 1);
};

function double(x) {
    console.log('double ' + x);
    return Promise.resolve(2 * x);
};

var transformations = [increment, double]

var promise = Promise.resolve(1);

for (var i = 0; i < transformations.length; i++) {
    promise = promise.then(transformations[i]);
}

promise.then(function(val) {
    console.log(val);
});
