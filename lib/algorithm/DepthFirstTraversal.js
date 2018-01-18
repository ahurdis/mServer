/**
 * DepthFirstTraversal.js
 * @author Andrew
 */
var Graph = require('../graph/Graph.js');

function DepthFirstTraversal(graph) {
    
    var self = this;
    
    self.graph = graph;
    
    self.ar = [];

    self.Traverse = function (vertex) {
        
        if (vertex) {
            var edges = graph.getEdgesFrom(vertex);
    
            for (var i in edges) {
                self.Traverse(self.graph.getVertexById(edges[i][0].targetId));
            }
            self.ar.push(vertex);
        }
    };

    self.GetFunctionArray = function (vertex) {
        self.ar = [];

        self.Traverse(vertex);
    
        return self.ar;
    };
};

module.exports = DepthFirstTraversal;