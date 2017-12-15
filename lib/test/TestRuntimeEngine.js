var readline = require('readline');

var Graph = require('../graph/Graph.js');
var RuntimeEngine = require('../algorithm/RuntimeEngine.js');

// var prompts = readline.createInterface(process.stdin, process.stdout);

var TestRuntimeEngine = function() {

    var graph = new Graph();

    var vertex1 = graph.addVertex({ name: 'Google', type: 'Company', x: 1 });
    var vertex2 = graph.addVertex({ name: 'Microsoft', type: 'Company', x: 2, y: 2});

    graph.addEdge(vertex1, vertex2, { name: 'My Edge', type: 'Edge', attributes: ['Neat', 'Wow'] } );

    var re = new RuntimeEngine(graph);

    re.Go();
};
   

try
{
    TestRuntimeEngine();
}
catch (e)
{
    console.log(e);
}