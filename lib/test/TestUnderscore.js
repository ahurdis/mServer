let _ = require('underscore');

let distinct = function (aro, key) {
    let ret = [];
    for (let out of _.uniq(_.pluck(aro, key))) {
        let t = {};
        t[key] = out;
        ret.push(t);
    }
    return ret;
};

let ar = [{ Continent: 'North America', Person: 'Elliott' },
{ Continent: 'Asia', Person: 'Clara' },
{ Continent: 'Africa', Person: 'Drew' },
{ Continent: 'North America', Person: 'Hilary' }];

let key = 'Continent';

let output = distinct(ar, key);



console.log(output);

// console.log(_.groupBy(ar, 'Continent'));

 /*
let output = _.filter(ar, {Continent: 'North America'});

let a = {'Continent':'North America'};
let b = {'Continent':'North America'};

if (_.isEqual(a,b)) console.log('equal');
*/


/*
let obj = { one: 1, two: 2 };
for (let [k,v] of Object.entries(obj)) {
    console.log(`${JSON.stringify(k)}: ${JSON.stringify(v)}`);
}
*/

/* 
const array = 
    [
        {'name':'Joe', 'age':17}, 
        {'name':'Bob', 'age':17}, 
        {'name':'Carl', 'age': 35}
    ];
*/