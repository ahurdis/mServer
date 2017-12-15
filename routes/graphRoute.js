var express = require('express');
var router = express.Router();

var url = require("url");
var queryString = require("querystring");
var Graph = require("../lib/graph/Graph.js");

var GraphData = require('../lib/graph/GraphData.js');
var Serialization = require('../lib/utility/Serialization.js');
var KnexHelper = require('../lib/utility/KnexHelper.js');
var WorkflowEngine = require('../lib/algorithm/WorkflowEngine.js');

// A list of constructors the smart reviver should know about  
Serialization.Reviver.constructors = { 'GraphData': GraphData, 'Graph': Graph };


var parseGraph = function (req) {
    // parses the request url
    var theUrl = url.parse(req.url);

    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse(theUrl.query);

    var o;

    try {
        o = JSON.parse(queryObj.jsonData, Serialization.Reviver);
    }
    catch (e) {
        console.log(e);
    }
    // and jsonData will be a property of it
    return o;
};

var parseJSONObject = function (req) {
    // parses the request url
    var theUrl = url.parse(req.url);

    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse(theUrl.query);

    // and jsonData will be a property of it
    return JSON.parse(queryObj.jsonData);
};

var createRelationship = function (req, res) {

    var obj = parseJSONObject(req);

    // get the graph 
};

var addVertex = function (req, res) {

    var obj = parseJSONObject(req);

    //    var v = graph.addVertex(obj);

    //    console.log(v.type);

    console.log('Created Vertex!');

    res.end('_testcb(' + 3 + ')');
};

var getGraph = function (req, res) {

    return parseGraph(req);
};

router.get('/', function (req, res, next) {
    addVertex(req, res);
});

router.get('/getgraph', function (req, res, next) {

    var graph = getGraph(req, res);

    var v = graph.getVertices();

    var kh = new KnexHelper();


    for (var i = 0; i < v.length; i++) {
        console.log('Adding table ' + v[i].instance);

        // get the keys to display, passing in the vertex's keys to exclude

        kh.addTable(v[i]);
    }
});

var inflateEdge = function (graph, edge, vertexType) {

    if (graph && edge && vertexType) {

        var edgeState = edge.getState();
        var vertexState = {
            argumentName: edgeState.argumentName,
            filterProperties: edgeState.filterProperties,
            type: vertexType
        };

        // for each edge, create a new node with the properties that the edge had
        var vertex = graph.addVertex(vertexState);

        // creates edges to the previous nodes with the properties that the edge had
        var sourceVertex = graph.getVertexById(edge.sourceId);
        var targetVertex = graph.getVertexById(edge.targetId);

        var upstreamEdge = {
            argumentName: sourceVertex.outboundType,
            filterProperties: edgeState.filterProperties
        };

        // are we being passed as a function parameter
        // or to a entire vertex
        var downstreamArgumentName;
        if (targetVertex.type === 'FunctionControl') {
            downstreamArgumentName = edgeState.argumentName;
        } else {
            downstreamArgumentName = targetVertex.inboundType;
        }

        var downstreamEdge = {
            argumentName: downstreamArgumentName,
            filterProperties: edgeState.filterProperties
        };

        // remove the edge from the graph
        graph.removeEdge(edge);

        graph.addEdge(sourceVertex, vertex, upstreamEdge);
        graph.addEdge(vertex, targetVertex, downstreamEdge);
    }
};



// inflate turns existing edges into nodes, preserving the connections
var inflate = function (graph) {
    var edges = graph.getAllEdges();

    for (var i = 0; i < edges.length; i++) {

        var sourceVertexType = graph.getVertexById(edges[i].sourceId).outboundType;
        var targetVertexType = graph.getVertexById(edges[i].targetId).inboundType;

        // if the source is a PhysicalEntityControl or a FileControl
        // inflate the graph to support filtering of attributes
        if (['PhysicalEntityControl', 'FileControl'].includes(graph.getVertexById(edges[i].sourceId).type)) {
            inflateEdge(graph, edges[i], 'FilterProperties');
        }

        // support type conversations
        if (sourceVertexType !== targetVertexType && sourceVertexType === 'o' && targetVertexType === 'aro') {
            inflateEdge(graph, edges[i], 'o2aro');
        }
    }
};

router.get('/runWorkflow', async function (req, res, next) {

    var graph = getGraph(req, res);

    //   graph.printStats(graph);
    inflate(graph);

    var v = graph.getVertices();

    for (var i = 0; i < v.length; i++) {
        console.log('Vertices includes: ' + v[i].instance + ' of type : ' + v[i].type);

        var e = graph.getEdgesTo(v[i]);

        if (e.length !== 0 && typeof e[0].type !== 'undefined') {
            console.log('Edges of type ' + e[0].type);
        }
    }

    console.log('Start your engine!');

    var wf = new WorkflowEngine({ graph: graph });

    try {
        await wf.create();
        wf.go(req, res);
    } catch (e) {
        console.log(e);
    }


    // res.end('_testcb()');

});

module.exports = router;
