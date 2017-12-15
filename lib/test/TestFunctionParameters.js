
let _ = require('underscore');

function getFunctionArguments(func) {  
    return (func + '')
      .replace(/[/][/].*$/mg,'') // strip single-line comments
      .replace(/\s+/g, '') // strip white space
      .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
      .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
      .replace(/=[^,]+/g, '') // strip any ES6 defaults  
      .split(',').filter(Boolean); // split & filter [""]
}; 


function getAllMethods(object) {
    return Object.getOwnPropertyNames(object).filter(function(property) {
        return typeof object[property] === 'function';
    });
};


var f = function foo (a, b) {};

// returns [ 'a', 'b' ]
console.log(getFunctionArguments(f));

// returns [ 'obj', 'n', 'guard' ]
console.log(getFunctionArguments(_.sample));

// get the type of the return value
console.log(typeof(_.sample(['a', 'b', 'c'])));

// foo doesn't return anything, so this is 'undefined'
console.log(typeof(f(null, null)));

// gets the name of a function
console.log(f.name);

console.log(getAllMethods(_));
