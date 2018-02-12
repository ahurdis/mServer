// JavaScript source code

/**
 * GraphMelder.js
 * @author Andrew
 */

define([],
    function () {

        'use strict';

        return function GraphMelder(options, contract) {

            var self = this;

            var getOutputVertices = function (graph) {

                var ret = [];
                var vertices = graph.getVertices();

                for (var v of vertices) {
                    if (graph.getEdgesFrom(v).length === 0) {
                        ret.push(v);
                    }
                }

                return ret;
            };

            var getGraphByName = function (name) {

                var ret = GraphStorage.getGraph(name);

                // if not in storage, get it from active documents
                if (!ret) {
                    var userDocument = app.getUserDocumentFromName(name);
                    ret = userDocument.getGraph();
                }
                return ret;
            };

            self.flattenGraph = function (graph) {

                var retGraph = graph.clone();

                var vertices = getOutputVertices(retGraph);

                self.flattenRecurse(retGraph, vertices[0]);

                return retGraph;
            };

            var getControl = function (graph, name) {

                var vertices = graph.getVertices();

                for (var i = 0; i < vertices.length; i++) {
                    if (vertices[i].type === name) {
                        return vertices[i];
                    }
                }
                return null;
            };

            var getUDFInControl = function (graph) {
                return getControl(graph, 'UDFInControl');
            };

            var getUDFOutControl = function (graph) {
                return getControl(graph, 'UDFOutControl');
            };

            self.flattenRecurse = function (graph, vertex) {

                var edges = graph.getEdgesTo(vertex);

                for (var i in edges) {

                    var childVertex = graph.getVertexById(edges[i].sourceId);

                    if (childVertex.type === 'UDFControl') {

                        // get the graph for the control from storage
                        var udfName = childVertex.instance;

                        var udfGraph = getGraphByName(udfName);

                        if (udfGraph) {

                            var udfInControl = getUDFInControl(udfGraph);

                            // get the input edges on the udfControl
                            var inputEdges = graph.getEdgesTo(childVertex);
                            // and attach them to the vertex with the UDFInControl                           
                            //                                childVertex.
                            for (var edge of inputEdges) {
                                graph.addEdge(childVertex,
                                    udfInControl,
                                    {
                                        argumentName: edge.argumentName,
                                        filterProperties: edge.filterProperties,
                                        type: edge.type
                                    });

                                //                                    graph.removeEdge(edge);
                            }

                            // now remove the original edges
                            // GOFIGURE: can this be done in the orginal loop?
                            for (var edge of inputEdges) {
                                graph.removeEdge(edge);
                            }

                            // self.flattenGraph(udfGraph);

                            // get the input edges of the graph
                            // and connect it to the node downstream of the udfControl

                        }
                    }

                    self.flattenRecurse(childVertex);
                }
            };
        }
    });
