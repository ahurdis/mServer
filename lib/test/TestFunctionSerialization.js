let _ = require('underscore');

function stringify_with_fns(obj) {
    return JSON.stringify(obj, function(key, value) {
        return typeof value === "function" ? value : value;
    });
};

function parse_with_fns(json) {
    return JSON.parse(json, function(key, value) {
        if (looks_like_a_function_string(value)) {
            return make_function_from_string(value);
        } else {
            return value; 
        }
    });
};

function looks_like_a_function_string(value) {
    return /^function.*?\(.*?\)\s*\{.*\}$/.test(value);
};

function make_function_from_string(value) {
    var args = value
        .replace(/\/\/.*$|\/\*[\s\S]*?\*\//mg, '') //strip comments
        .match(/\(.*?\)/m)[0]                      //find argument list
        .replace(/^\(|\)$/, '')                    //remove parens
        .match(/[^\s(),]+/g) || [],                //find arguments
        body = value.match(/\{(.*)\}/)[1]          //extract body between curlies

    return Function.apply(0, args.concat(body));
};

/*


let x = parse_with_fns(stringify_with_fns({a: function() {var x=1;}}))
*/

let x = parse_with_fns(stringify_with_fns({a: _.uniq}))

console.log(x.a.toString());

console.log(x.a([1,2,3,1].toString()));
