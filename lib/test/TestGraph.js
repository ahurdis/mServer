

var Graph = require('../graph/Graph.js');

try {
    var graph = new Graph();
    
    var vertex1 = graph.addVertex({ name: 'File', type: 'Company' });
    var vertex2 = graph.addVertex({ name: 'Sample', type: 'Company' });
    var vertex3 = graph.addVertex({ name: 'Grid', type: 'Toy' });
    
    
    var edge1 = graph.addEdge(vertex1, vertex2, { name: 'Co-developed Google and Microsoft product', cardinality: '1..*', type: 'Partnership' });
 //   graph.addEdge(vertex1, vertex2, { name: 'Google', cardinality: '0..1', type: 'Partnership' });
    var edge2 = graph.addEdge(vertex2, vertex3, { name: 'Google', cardinality: '0..1', type: 'Partnership' });
 //   graph.addEdge(vertex3, vertex4, { name: 'Google', cardinality: '0..1', type: 'Partnership' });

    graph.removeEdge(edge1);
    
    console.log(graph.toJSON());

    graph.inflate();

    console.log(graph.toJSON());
    

    /*
    console.log('Vertex 1 and 2 have these edges: ');
    var edges = graph.getEdgesFrom(vertex1, vertex2);
    
    var count = 0;
   
    for (var i in edges) {
        console.log(edges[i].PrintName()); //"aa", "bb"
    }
    */
}
catch (e) {
    console.log(e);
}
