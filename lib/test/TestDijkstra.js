/**
 * TestDijkstra.js
 * @author Andrew
 */
var Dijkstra = require('../algorithm/Dijkstra.js');
var Graph = require('../graph/Graph.js');
var GraphData = require('../graph/GraphData.js');

// The adjacency matrix defining the graph.
var _ = Infinity;

var e = [
  [ _, _, _, _, _, _, _, _, 4, 2, 3 ],
  [ _, _, 5, 2, 2, _, _, _, _, _, _ ],
  [ _, 5, _, _, _, 1, 4, _, _, _, _ ],
  [ _, 2, _, _, 3, 6, _, 3, _, _, _ ],
  [ _, 2, _, 3, _, _, _, 4, 3, _, _ ],
  [ _, _, 1, 6, _, _, 2, 5, _, _, _ ],
  [ _, _, 4, _, _, 2, _, 5, _, _, 3 ],
  [ _, _, _, 3, 4, 5, 5, _, 3, 2, 4 ],
  [ 4, _, _, _, 3, _, _, 3, _, 3, _ ],
  [ 2, _, _, _, _, _, _, 2, 3, _, 3 ],
  [ 3, _, _, _, _, _, 3, 4, _, 3, _ ]
];

try
{
    var graph = new Graph();

    var vertex0 = graph.addVertex({ name: 'Dragon', type: 'noun' });
    var vertex1 = graph.addVertex({ name: 'Kid', type: 'noun' });    
    var vertex2 = graph.addVertex({ name: 'Sock', type: 'noun' });    
    var vertex3 = graph.addVertex({ name: 'Cheese', type: 'noun' });
    var vertex4 = graph.addVertex({ name: 'Cow', type: 'noun' });
 
    graph.addEdge(vertex0, vertex1, { name: 'eat', type: 'verb', cardinality: '0..*' });
    graph.addEdge(vertex1, vertex2, { name: 'wear', type: 'verb', cardinality: '0..*' });
    graph.addEdge(vertex2, vertex3, { name: 'taste', type: 'verb', cardinality: '0..*' });
    graph.addEdge(vertex3, vertex4, { name: 'comes from', type: 'verb', cardinality: '0..*' });
    
    graph.addEdge(vertex0, vertex4, { name: 'eat', type: 'Toy', cardinality: '0..*' });
    
    var edge = graph.getEdgesBetween(vertex0, vertex1);


    /*
    for (var i in vertices) {
        console.log(vertices[i].name);
    }
    */

    console.log('The Adjacency Matrix is:');

    var a = graph.getAdjacencyMatrix();
    console.log(a);
    console.log();
    
    var dijkstra = new Dijkstra();
    
    var startVertex = 0,
        endVertex = 3;

    console.log('Shortest path from Vertex' + startVertex);
    var shortestPathInfo = dijkstra.shortestPath(a, a.length, startVertex);
    console.log(shortestPathInfo);
    console.log();
    
    var path = dijkstra.constructPath(shortestPathInfo, endVertex);

    var vertices = graph.getVertices();
  //  var edges = graph.getEdgesFrom();
    
    
    path.unshift(0);

    for (var i = 0; i < path.length; i++) {
                
        console.log(vertices[path[i]].name + 's ');
        
        if (i + 1 < path.length) {
            var edge = graph.getEdgesBetween(vertices[path[i]], vertices[path[i + 1]]);
            
            console.log(' ' + edge[0].name);
        }
    }
    console.log();

    console.log('Vertex 0 to Vertex' + endVertex);
    console.log(path);
}
catch (e)
{
    console.log(e);
}