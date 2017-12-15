let _ = require('underscore');

let distinct = function(aro, key) {
    return _.uniq(aro, (obj) => { return obj[key] });
};

let ar = [{Continent:'North America', Person: 'Elliott'},
                        {Continent:'Asia', Person: 'Clara'},
                        {Continent:'Africa', Person: 'Drew'},
                        {Continent:'North America', Person: 'Hilary'}];

// let output = distinct(ar, 'Continent');


let output = _.filter(ar, {Continent: 'North America'});

let a = {'Continent':'North America'};
let b = {'Continent':'North America'};

if (_.isEqual(a,b)) console.log('equal');

console.log(output);

let obj = { one: 1, two: 2 };
for (let [k,v] of Object.entries(obj)) {
    console.log(`${JSON.stringify(k)}: ${JSON.stringify(v)}`);
}


/* 
const array = 
    [
        {'name':'Joe', 'age':17}, 
        {'name':'Bob', 'age':17}, 
        {'name':'Carl', 'age': 35}
    ];
*/