var Graph = require('../graph/Graph.js');
var GraphData = require('../graph/GraphData.js');

// get the control library
var ControlLibrary = require('../model/ControlLibrary.js');

var graph = new Graph();

var GetLineage = function (vertex) {
    
    var myPath = [];
    
    var Recurse = function (vertex) {

        var edges = graph.getEdgesFrom(vertex);

        for (var i in edges) {

            var theID = edges[i].id;

            Recurse(graph.getVertexById(edges[i][0].targetId));
        }
        myPath.push(vertex.type);
    };
    
    Recurse(vertex);

    return myPath;
};

try {
  
    var grandparent = graph.addVertex({ name: 'Dave', type: 'GrandParent'});
    var dad = graph.addVertex({ name: 'Drew', type: 'Parent'});
    var elliott = graph.addVertex({ name: 'Elliott', type: 'Child'});
    var clara = graph.addVertex({ name: 'Clara', type: 'Child'});
    
    graph.addEdge(elliott, dad, { name: 'Inheritance', type: 'Generalization' });
    graph.addEdge(clara, dad, { name: 'Inheritance', type: 'Generalization' });
    graph.addEdge(dad, grandparent, { name: 'Inheritance', type: 'Generalization' });
    
    var path = GetLineage(elliott);

    for (var i=0; i < path.length; i++) {
        console.log(path[i]);
    }
}
catch (e) {
    console.log(e);
}