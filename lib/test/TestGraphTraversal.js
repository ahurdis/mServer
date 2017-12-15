var Graph = require('../graph/Graph.js');
var DepthFirstTraversal = require('../algorithm/DepthFirstTraversal.js');
var Promise = require('bluebird');

var fp = function (vertex) { setTimeout(function () { console.log(vertex.name); }, this.delay); return 1;};

try {
    var graph = new Graph();
    
    var vertex1 = graph.addVertex({ id: 1, name: 'A', type: 'Company', delay: 0, f: fp });
    var vertex2 = graph.addVertex({ id: 2, name: 'B', type: 'Company', delay: 0, f: fp });
    var vertex3 = graph.addVertex({ id: 3, name: 'C', type: 'Toy', delay: 1000, f: fp });
    
    
    graph.addEdge(vertex1, vertex2, { id: 1, name: 'Co-developed Google and Microsoft product', type: 'Partnership' });
    graph.addEdge(vertex1, vertex3, { id: 2, name: 'Google', cardinality: '0..1', type: 'Partnership' });
    
    var dft = new DepthFirstTraversal(graph);
    
    var ar = dft.GetFunctionArray(vertex1);
    
  //  var funcs = Promise.resolve(ar);

    var sum = 0;
    for (var i = 0; i < ar.length; i++) {
        sum += ar[i].f(ar[i]);
    }
    
    console.log(sum);
}
catch (e) {
    console.log(e);
}
