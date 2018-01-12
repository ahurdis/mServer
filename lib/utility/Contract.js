/**
 * Contract.js
 * @author Andrew
 */

'use strict';

/*

Every GraphData must have   - type, id, name
                may have    - description

    var contractBase = function(options)
    {
        Contract.expectNumber(options.id, 'GraphData::id'); 
        Contract.expectString(options.name, 'GraphData::name.'); 
        Contract.expectString(options.type, 'GraphData::type.'); 
    };

Every GraphData of type 'MetaEdgeData' must have - cardinality

*/

function Contract() 
{};

Contract.expect = function(condition, msg){
    if (!condition) {
        throw new Error(Contract.getMessage('The required condition was not met', msg));
    }
};
    
// These methods are used for preconditions
Contract.expectType = function (arg, type, msg){
    var argType = typeof arg;
    if (argType !== type) {
        msg = Contract.getMessage("The argument was not of expected type: '" + type + "' - was '" + argType + "'", msg);
        throw new Error(msg);
    }
};

Contract.expectFunction = function(arg, msg){
    Contract.expectType(arg, 'function', msg);
};

Contract.expectNumber = function(arg, msg){
    Contract.expectType(arg, 'number', msg);
};

Contract.expectString = function (arg, msg){
    Contract.expectType(arg, 'string', msg);
};

Contract.expectObject = function(arg, msg){
    Contract.expectType(arg, 'object', msg);
};

Contract.expectRegExp = function (arg, msg){
    Contract.instanceOf(arg, RegExp, msg);
};
    
Contract.expectValue = function (arg, values, msg){
    if (!values instanceof Array) {
        values = [values];
    }
    var i = values.length;
    while (i--) {
        if (arg === values[i]) {
            return;
        }
    }
    throw new Error(getMessage("argument has an invalid value, '" + arg + "' not in '" + values.join() + "'", msg));
};
    
Contract.expectWhen = function(precondition, condition, msg){
    if (precondition) {
        Contract.expect(condition, msg);
    }
};

Contract.ofType = function (obj, type){
    return (typeof obj === type);
};

Contract.instanceOf = function (arg, type, msg){
    if (!(arg instanceof type)) {
        msg = Contract.getMessage('The argument was not an instance of type: ' + type.name, msg);
        throw new Error(msg);
    }
};

Contract.getMessage = function(base, msg){
    return base + ((typeof msg === 'undefined') ? '.' : (" - '" + msg + "'."));
};

module.exports = Contract;
