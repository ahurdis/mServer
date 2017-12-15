var readline = require('readline');

var Contract = require('../utility/Contract.js');
var Graph = require('../graph/Graph.js');

var prompts = readline.createInterface(process.stdin, process.stdout);

var TestFilters = function() {

    var graph = new Graph();

    var vertex1 = graph.addVertex({ name: 'Google', type: 'Company', x: 1 });
    var vertex2 = graph.addVertex({ name: 'Microsoft', type: 'Company', x: 2, y: 2});

    graph.addEdge(vertex1, vertex2, { attributes: ['Neat', 'Wow'] } );

    // callback should accept one argument: Vertex
    var eachVertex = function (callback) {
        var t = this;
        graph.getVertices().forEach(function (v) {
            callback.call(t, v);
        });
    };

    // callback should accept one argument: Edge
    var eachEdge = function (callback) {
        var t = this;
        graph.edges.forEach(function (e) {
            callback.call(t, e);
        });
    };

    eachVertex(function(v) { 
        if (v.x === 1)
        {
            Contract.expect(v.name === 'Google', 'Test failure!  Expected v.name === Google');
            console.log(v.name) 
        }
    });

    eachEdge(function(e) { 
        console.log(e.attributes);
    });
};

try
{
    TestFilters();
}
catch (e)
{
    prompts.write(e);
}

prompts.question('Hit Enter to exit...', function() {
    process.exit();
});
