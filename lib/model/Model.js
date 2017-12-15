/*
 * Model.js
 * @author Andrew
 */

"use strict";

var Graph = require("../graph/Graph.js");
var GraphData = require("../graph/GraphData.js");

var MetaModel = require('../meta/MetaModel.js');

function Model()
{
    var self = this;

    var metaModel = new MetaModel();

    var graph = new Graph();

    // get the graph object of this model
    self.GetGraph = function()
    {
        return graph;
    };

    // add a vertex to the model if permitted by the metamodel
    self.addVertex = function(vertex)
    {
        var ret = null;

        // confirm this vertex is part of the metamodel
        if (metaModel.PermitsVertex(vertex)) {
            // add the vertex to the graph
            ret = graph.addVertex(vertex);
        }
        return ret;
    };

    // add an edge to the model if permitted by the metamodel
    self.addEdge = function(source, target, edge)
    {
        // get the number of edges of this type already in the model 
        var cardinality = 0;

        var edges = graph.getAllEdges();

        for (var i in edges) {
            if (edges[i].source.type === source.type &&
                edges[i].target.type === target.type)
            {
                cardinality++;
            }
        }

        // confirm that and edge of this type and cardinality is permitted by the metamodel
        if (metaModel.PermitsEdge(source, target, edge, cardinality)) {
            // add the edge to the graph
            graph.addEdge(source, target, edge);
        }
    };

    // function that creates the model
    var Initialize = function()
    {
        var developmentPhase = self.addVertex({ id: 7, type : 'Attribute', name: 'Development Phase',  inScope : 'Yes' });
        var subjectMinAge = self.addVertex({ id: 16, type : 'Attribute', name: 'Subject Min Age', inScope : 'Yes' });

        var cal = self.addVertex({ type: 'System', name: 'CAL'});

        var consumerOne = self.addVertex({ type: 'System', name: 'Development Phase Consuming System' });
        var consumerTwo = self.addVertex({ type: 'System', name: 'Subject Min Age Consuming System' });

        self.addEdge(cal, consumerOne, { type: "ETL", name: 'System - System' });
        self.addEdge(cal, consumerTwo, { type: "ETL", name: 'System - System' });


        self.addEdge(cal, developmentPhase, { type: 'Attribute - System', name: 'R' });
        self.addEdge(cal, subjectMinAge, { type: 'Attribute - System', name: 'R' });

        self.addEdge(consumerOne, developmentPhase, { type: 'Attribute - System', name: 'R' });

        self.addEdge(consumerTwo, developmentPhase, { type: 'Attribute - System', name: 'R' });
        self.addEdge(consumerTwo, subjectMinAge, { type: 'Attribute - System', name: 'R' });

        // Add this in to created a circular dependency for serialization test
       // self.addEdge(consumerB, cal, new GraphData({ name: 'System - System', attributes: [subjectMinAge] }));

        // this should fail
        // self.addEdge(clinicalStudy, cal, new GraphData({ name: 'Entity - System' }));
        
        // as should this
        // self.addEdge(vertexAttribute, vertexSystem, new GraphData({ name: 'Attribute - System' }));

    };

    Initialize();
};

module.exports = Model;
