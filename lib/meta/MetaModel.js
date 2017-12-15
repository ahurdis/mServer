/*
 * MetaModel.js
 * @author Andrew
 */

"use strict";

var Cardinality = require('../meta/Cardinality.js');
var Graph = require("../graph/Graph.js");
var GraphData = require("../graph/GraphData.js");

function MetaModel()
{
    var self = this;

    var graph = new Graph();

    this.GetGraph = function()
    {
        return graph;
    };

    this.PermitsVertex = function (vertex)
    {
        var permit = false;

        if (vertex != null) {
            var vertexType = vertex.type;
            var vertices = graph.getVertices();

            for (var i in vertices) {
                if (vertexType === vertices[i].name) {
                    permit = true;
                    break;
                }
            }
        }

        if (permit === false) {
            throw new Error('Vertex of type ' + vertex.type + ' not permitted.');
        }

        return permit;
    };

    this.PermitsEdge = function (source, target, edge, cardinality)
    {
        var permit = false;

        var sourceVertexType = source.type;
        var targetVertexType = target.type;

        var errorText = 'Edge between ' + sourceVertexType + ' and ' + targetVertexType + ' not permitted.  ';

        if (edge != null) {
            
            var edges = graph.getAllEdges();

            for (var i in edges) {
                // Are these entities connected in the metamodel
                if (sourceVertexType === graph.getVertexById(edges[i].sourceId).name &&
                    targetVertexType ===  graph.getVertexById(edges[i].targetId).name) {

                    // get the permitted cardinality 
                    var permittedCardinality = edges[i].cardinality;

                    // check that we're within the permitted cardinality
                    if (permittedCardinality === Cardinality.ONE_ONE && cardinality > 0) {
                        errorText += 'Cardinality ' + permittedCardinality + ' exceeded.  ';
                        break;
                    }

                    permit = true;
                    break;
                }
            }
        }

        if (permit === false) {
            throw new Error(errorText);
        }

        return permit;
    };

    var Initialize = function()
    {
        var attribute = graph.addVertex({ type : 'MetaVertex',  name : 'Attribute' });
        var entity = graph.addVertex({ type : 'MetaVertex',  name : 'Entity' });
        var process = graph.addVertex({ type : 'MetaVertex',  name : 'Process'});
        var system = graph.addVertex({ type : 'MetaVertex',  name : 'System'});

        graph.addEdge(entity, attribute, { type: 'MetaEdgeData', name : 'Entity - described by - Attribute', cardinality: Cardinality.ONE_MANY });
        graph.addEdge(attribute, process, { type: 'MetaEdgeData', name : 'Attribute - employed in accomplishing something by - Process', cardinality: Cardinality.MANY_MANY });
        graph.addEdge(system, attribute, { type: 'MetaEdgeData', name : 'System - maintains - Attribute', cardinality: Cardinality.MANY_MANY });
        graph.addEdge(system, system, { type: 'MetaEdgeData', name : 'System - exchanges data with - System', cardinality: Cardinality.MANY_MANY });
    };

    Initialize();
};

module.exports = MetaModel;
