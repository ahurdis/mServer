/*
 * Graph.js
 * @author Andrew
 */

var GraphData = require("./GraphData.js");
var Serialization = require('../utility/Serialization.js');

function Graph() {

    'use strict';

    var self = this;

    self.vertices = [];
    self.adjacency = {};

    self.nextNodeId = 1;
    self.nextEdgeId = 1;

    self.addVertex = function (options) {

        if (typeof (options.id) === 'undefined') {
            options.id = self.nextNodeId++;
        }

        var vertex = new GraphData(options);

        if (vertex !== null) {
            if (!(self.getVertexById(vertex.id))) {
                self.vertices.push(vertex);
            }
        }
        return vertex;
    };

    self.printStats = function () {

        console.log('The graph has this many nodes in it: ' + self.count());

        var v = self.getVertices();
        for (var i = 0; i < v.length; i++) {
            console.log('Vertices ids: ' + v[i].id);
        }

        console.log();

        console.log('The graph has this many edges in it: ' + e.length);
        var e = self.getAllEdges();
        for (var i = 0; i < e.length; i++) {
            console.log('Edge ids: ' + e[i].id);

            console.log('\tSource: ' + e[i].sourceId);
            console.log('\tTarget: ' + e[i].targetId);
        }
    };

    self.addVertexProperty = function (vertex, key, value) {

        // now add the property to the vertices array GraphData
        if (vertex !== null) {
            vertex.insertProperty(key, value);
        }
    };

    self.addEdgeProperty = function (edge, key, value) {

        // now add the property to the vertices array GraphData
        if (edge !== null) {
            edge.insertProperty(key, value);
        }
    };

    function createArray(length) {

        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) arr[length - 1 - i] = createArray.apply(this, args);
        }

        return arr;
    };

    self.getVertexById = function (id) {

        var ret = null;
        for (var i = self.vertices.length - 1; i >= 0; i--) {
            if (self.vertices[i].id === id) {
                ret = self.vertices[i];
                break;
            }
        }
        return ret;
    };

    self.getAdjacencyMatrix = function () {

        var vertexCount = self.count();

        var a = createArray(vertexCount, vertexCount);

        for (var i = 0; i < vertexCount; i++) {
            for (var j = 0; j < vertexCount; j++) {
                if (typeof (self.adjacency[i]) !== 'undefined') {
                    if (typeof (self.adjacency[i][j]) !== 'undefined') {
                        a[i][j] = 1;
                    }
                    else {
                        a[i][j] = Infinity;
                    }
                }
                else {
                    a[i][j] = Infinity;
                }
            }
        }

        return a;
    };

    self.addEdge = function (source, target, options) {

        if (typeof (options) !== 'undefined') {
            options.id = self.nextEdgeId++;
            options.sourceId = source.id;
            options.targetId = target.id;
        }

        var edge = new GraphData(options);

        if (edge != null) {

            // Are we already in the adjacency "matrix"?
            if (!(edge.sourceId in self.adjacency)) {
                self.adjacency[edge.sourceId] = {};
            }

            if (!(edge.targetId in self.adjacency[edge.sourceId])) {
                self.adjacency[edge.sourceId][edge.targetId] = [];
            }

            var exists = false;
            self.adjacency[edge.sourceId][edge.targetId].forEach(function (e) {
                if (edge.id === e.id) { exists = true; }
            });

            if (!exists) {
                self.adjacency[edge.sourceId][edge.targetId].push(edge);
            }
        }
        return edge;
    };

    // get all vertices
    self.getVertices = function () {
        return self.vertices;
    };

    // find the edges from vertex1 to vertex2
    self.getEdgesBetween = function (vertex1, vertex2) {
        if (vertex1.id in self.adjacency
            && vertex2.id in self.adjacency[vertex1.id]) {
            return self.adjacency[vertex1.id][vertex2.id];
        }

        return [];
    };

    // find all edges from a given vertex 
    self.getEdgesFrom = function (vertex) {
        if (vertex.id in self.adjacency) {
            return self.adjacency[vertex.id];
        }

        return [];
    };

    // find all edges to a given vertex 
    self.getEdgesTo = function (vertex) {

        var arRet = [];

        var arEdges = self.getAllEdges();

        for (var i = 0; i < arEdges.length; i++) {
            if (arEdges[i].targetId === vertex.id) {
                arRet.push(arEdges[i]);
            }
        }

        return arRet;
    };

    // Returns true if the Graph contains an edge
    self.containsEdge = function (edge) {

        var arEdges = self.getAllEdges();

        arEdges.forEach(function (e) {
            if (edge === e) { return true; }
        });

        return false;
    };

    // removes edges associated with a given vertex
    self.detachVertex = function (vertex) {

        var tmpEdges = self.getAllEdges();
        tmpEdges.forEach(function (e) {
            if (e.sourceId === vertex.id || e.targetId === vertex.id) {
                self.removeEdge(e);
            }
        }, self);
    };

    // get all edges for all vertices
    self.getAllEdges = function () {

        var arRet = [];

        for (var x in self.adjacency) {
            for (var y in self.adjacency[x]) {
                var edges = self.adjacency[x][y];

                arRet.push.apply(arRet, edges);
            }
        }

        return arRet;
    };

    // remove a vertex and it's associated edges from the graph
    self.removeVertex = function (vertex) {

        for (var i = self.vertices.length - 1; i >= 0; i--) {
            if (self.vertices[i].id === vertex.id) {
                self.vertices.splice(i, 1);
            }
        }

        self.detachVertex(vertex);
    };

    // remove an edge from the graph
    self.removeEdge = function (edge) {

        for (var x in self.adjacency) {
            for (var y in self.adjacency[x]) {
                var edges = self.adjacency[x][y];

                for (var j = edges.length - 1; j >= 0; j--) {
                    if (self.adjacency[x][y][j].id === edge.id) {
                        self.adjacency[x][y].splice(j, 1);
                    }
                }

                // Clean up empty edge arrays
                if (self.adjacency[x][y].length == 0) {
                    delete self.adjacency[x][y];
                }
            }

            // Clean up empty objects
            if (self.isEmpty(self.adjacency[x])) {
                delete self.adjacency[x];
            }
        }
    };

    self.filterVertices = function (fn) {
        var tmpVertices = self.vertices.slice();
        tmpVertices.forEach(function (n) {
            if (!fn(n)) {
                self.RemoveVertex(n);
            }
        }, self);
    };

    // determines is adjacency entry is empty for cleanup
    self.isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    };

    // Gets the vertex count
    self.count = function () {
        return self.vertices.length;
    };

    // Returns true if the Graph contains a vertex
    self.containsVertex = function (vertex) {

        self.vertices.forEach(function (v) {
            if (vertex === v) { return true; }
        });

        return false;
    };

    // Initialize the state of the graph
    self.clear = function () {
        self.vertices = [];
        self.adjacency = {};
    };

    self.toJSON = function () {

        var rv = {
            ctor: "Graph",
            data: {
                vertices: self.vertices,
                adjacency: self.adjacency,
                nextNodeId: self.nextNodeId,
                nextEdgeId: self.nextEdgeId
            }
        };

        return Serialization.toJSON(rv.ctor, rv.data);
    };
};

Graph.fromJSON = function (value) {
    return Serialization.fromJSON(Graph, value);
};

module.exports = Graph;

