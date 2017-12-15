var Graph = require('../graph/Graph.js');
var PathExpression = require('../graph/PathExpression.js');

var graph = new Graph();

var InheritProperties = function (vertex) {
    
    var edges = graph.getAllEdges();
    
    var objMerge = {};
    
    var Recurse = function (vertex) {
        for (var i in edges) {
            if (edges[i].sourceId === vertex.id && edges[i].type === 'Generalization') {
                Recurse(graph.getVertexById(edges[i].targetId));
            }
        }
        objMerge = Merge(objMerge, vertex.getState());
    };
    
    Recurse(vertex);

    return objMerge;
};

try {

    var vertex0 = graph.addVertex({ name: 'Dragon', type: 'monster' });
    
    var vertex1 = graph.addVertex({ name: 'Elliott', type: 'person' });
    var vertex2 = graph.addVertex({ name: 'Drew', type: 'person' });
    
    var vertex3 = graph.addVertex({ name: 'Gold', type: 'metal' });
    
    var vertex4 = graph.addVertex({ name: 'Socks', type: 'clothing', fabric: 'Denim' });
    var vertex5 = graph.addVertex({ name: 'Hat', type: 'clothing', fabric: 'Wool' });
    

    graph.addEdge(vertex0, vertex1, { name: 'eat', type: 'verb', cardinality: '0..*' });    
    graph.addEdge(vertex0, vertex2, { name: 'eat', type: 'verb', cardinality: '0..*' });
    graph.addEdge(vertex0, vertex3, { name: 'lust after', type: 'verb', cardinality: '0..*' });
    
    graph.addEdge(vertex1, vertex4, { name: 'wear', type: 'verb', cardinality: '0..*' });
    graph.addEdge(vertex2, vertex5, { name: 'wear', type: 'verb', cardinality: '0..*' });
    
    var pe = new PathExpression({ graph : graph });

    var vertexArray = pe.v(vertex0).out({ type: 'person' }).out({ type: 'clothing', fabric: 'Denim' });
    
    for (var i = 0; i < vertexArray._av.length; i++) {
        console.log(vertexArray._av[i].name);
    }

  //  debugger;
}
catch (e) {
    console.log(e);
}

