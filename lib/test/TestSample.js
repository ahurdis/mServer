let _ = require('underscore');

const a = [ 'A,B,C', '1,2,3' ];

b = _.sample(a, 1);

console.log(b.toString());