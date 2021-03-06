/**
 * @author Andrew
 */

define(['javascripts/source/graph/Graph',
    'javascripts/source/graph/GraphSerialization'],
    function (Graph, GraphSerialization) {

        'use strict';

        try {

            var GraphStorage = function GraphStorage() {

            };

            GraphStorage.saveObject = function (key, graph) {

                var strJSON = JSON.stringify(graph);

                if (typeof (Storage) !== 'undefined') {
                    localStorage.setItem(key + ' Graph', strJSON);

                    // now serialize the tableshape(s) for the graph (i.e. the controls and connectors)
                    var vertices = graph.getVertices();
                    // get the vertices for the graph
                    vertices.forEach(function (vertex) {
                        var strVertexShape = JSON.stringify(vertex.shape);
                        localStorage.setItem(key + ' Graph Vertex ' + vertex.id, strVertexShape);
                    }, this);

                    // get the edge for the graph
                    var edges = graph.getAllEdges();
                    // get the vertices for the graph
                    edges.forEach(function (edge) {
                        var strEdgeShape = JSON.stringify(edge.shape);
                        localStorage.setItem(key + ' Graph Edge ' + edge.id, strEdgeShape);
                    }, this);
                }
            };

            GraphStorage.forAllDocuments = function (callback) {

                if (typeof (Storage) !== 'undefined') {

                    var userDocument;

                    for (var key of Object.getOwnPropertyNames(localStorage)) {

                        var index = key.indexOf('Graph');

                        if (index === -1) {

                            var strJSON = localStorage.getItem(key);

                            if (strJSON && callback) {
                                userDocument = JSON.parse(strJSON);

                                callback(userDocument);
                            }
                        }
                    }
                }
            };

            GraphStorage.getGraph = function (key) {
                return GraphStorage.loadObject(key + ' Graph');
            };

            GraphStorage.loadObject = function (key) {

                var graph = null;

                if (typeof (Storage) !== 'undefined') {

                    // Get back the array of vertex serializers
                    var strJSON = localStorage.getItem(key);

                    if (strJSON !== null) {
                        graph = JSON.parse(strJSON, GraphSerialization.Reviver);
                    }
                }

                return graph;
            };

            return GraphStorage;

        }
        catch (e) {
            alert('GraphStorage: ctor ' + e.name + ' ' + e.message);
        }
    });