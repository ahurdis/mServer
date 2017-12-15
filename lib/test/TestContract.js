var GraphData = require('../graph/GraphData.js');
var Contracts = require('../model/Contracts.js');


var TestContract = function() {

    var vertexData = new GraphData({ id: 1, nom: 'Age', type: 'Attribute' });

    var vertexData = new GraphData({ id: 1,  name: 'Age', type: 'Attribute',  description: 'Your age.'});
};


try
{
    TestContract();
}
catch (e)
{
    console.log(e);
}


    /* Begin Test 1 

    // now make a contract for a GraphData that expects three contraints
    // a parameter of type number named 'a' 
    // a parameter of type number named 'b' 
    // moreover, parameter b cannot be equal 0

    var contractRational = function(options)
    {
        Contract.expectNumber(options.a, 'a must be a number.'); 
        Contract.expectNumber(options.b, 'b must be a number.'); 
        Contract.expect(options.b !== 0, 'Come now - a denominator cannot be zero!');
    };

    var vertexData = new GraphData({ id: 1, name: 'Google', type: 'Attribute', a: 1, b : 0 }, contractRational);

    /* End Test 1 */