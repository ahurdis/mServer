/*
 * PathExpression.js
 * @author Andrew
 */

"use strict";

var Cardinality = require('../meta/Cardinality.js');
var Graph = require("../graph/Graph.js");
var GraphData = require("../graph/GraphData.js");

function PathExpression(options)
{
    var self = this;

    self._graph = options.graph;
  //  self._av = [self._graph.getVertexById(options.startVertexId)] || [];
    
    self.v = function (vertex) {
        self._av = [vertex];
        return self;
    };
    
    /*
    self.v = function (vertexId) {
        self._av = [self._graph.getVertexById(vertexId)];
        return self;
    };
    */

    // TODO: make filter accept multiple arguments

    self.out = function(filter) {
        
        // the path expression that we return to the chain        
        var peRet = new PathExpression({ graph : self._graph });
        
        // the resulting vertices that we add to the returned path expression
        var av = [];

        // recurse over all vertices and edges, filtering source and target have all the same properties and values 
        for (var iVertices = 0; iVertices < self._av.length; iVertices++) {
            
            var edges = self._graph.getEdges(self._av[iVertices]);

            for (var iEdge in edges) {
                
                var edge = edges[iEdge][0];

                if (edge.sourceId === self._av[iVertices].id) {
                    
                    // here we have to test the graph data to see if it has the propert(ies) passed in
                    
                    var arFilterObjectProperties = Object.getOwnPropertyNames(filter);
                    
                    var target = self._graph.getVertexById(edge.target);
                    // get the properties of the target
                    var arTargetObjectProperties = Object.getOwnPropertyNames(target);
                    
                    // for performance reasons, we assume that the filter will be the shortest array
                    // and we put that in the for loop

                    var arCommonProperties = [];
                    var j = 0;
                    for (var iFilter = 0; iFilter < arFilterObjectProperties.length; ++iFilter) {
                        if (arTargetObjectProperties.indexOf(arFilterObjectProperties[iFilter]) != -1) {
                            arCommonProperties[j++] = arFilterObjectProperties[iFilter];
                        }
                    }
                    // do the source and target have all the same properties and values?
                    // if so, add it to our resultset
                    
                    var bMatch = true;
                    
                    arCommonProperties.forEach(function (val, idx, array) {
                        if (target[val] !== filter[val]) {
                            bMatch = false;        
                        }
                    });     

                    if (bMatch) {
                        av.push(target);
                    }
                }
            }
        }
        
        peRet._av = av;
        
        return peRet;
    };
};

module.exports = PathExpression;
