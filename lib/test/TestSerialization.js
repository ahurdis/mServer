var readline = require('readline');

var Graph = require('../graph/Graph.js');
var GraphData = require('../graph/GraphData.js');
var Serialization = require('../utility/Serialization.js');

var prompts = readline.createInterface(process.stdin, process.stdout);

var TestSerialization = function() {

    // A list of constructors the smart reviver should know about  
    Serialization.Reviver.constructors = { 'GraphData' : GraphData, 'Graph' : Graph }; 

    console.log('*******GraphData********');

    var before = new GraphData({ id: 1, type: 'Generic', name: 'Development Phase Consuming System', size: 'XL' });

    var strJSON = JSON.stringify(before);

    console.log(strJSON);

    var after = JSON.parse(strJSON, Serialization.Reviver);

    console.log(after.name);
    console.log(after.size);

    console.log('********Graph*******');

    before = new Graph();

    var vertex1 = before.addVertex({ name: 'Google', type: 'Company' });
    var vertex2 = before.addVertex({ name: 'Microsoft', type: 'Company' });
  //  var vertex3 = before.addVertex({ name: 'Elmo', type: 'Toy' });

    before.addEdge(vertex1, vertex2, { name: 'Edge', type: 'ETL', cardinality: '1..*' });
 //   before.addEdge(vertex1, vertex2, { name: 'Edge', type: 'ETL', cardinality: '0..1' });
 //   before.addEdge(vertex2, vertex3, { name: 'Edge', type: 'ETL', cardinality: '0..1' });

    console.log('The graph has this many nodes in it:');
    console.log(before.count());

    console.log('Vertex 1 and 2 have these edges: ');
    console.log(before.getEdgesFrom(vertex1, vertex2));

    strJSON = JSON.stringify(before);
    console.log(strJSON);

    after = JSON.parse(strJSON, Serialization.Reviver);

    console.log('The graph has this many nodes in it:');
    console.log(after.count());

    console.log('Vertex 1 and 2 have these edges: ');
    console.log(after.getEdgesFrom(vertex1, vertex2));

    var vertex3 = after.addVertex({ name: 'Bitforge', type: 'Company' });

    console.log('The graph has this many nodes in it:' + after.count());
};


try
{
    TestSerialization();
}
catch (e)
{
    prompts.write(e);
}

prompts.question('Hit Enter to exit...', function() {
    process.exit();
});
