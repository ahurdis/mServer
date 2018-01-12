var express = require('express');
var router = express.Router();
/*
var url = require('url');
var queryString = require('querystring');
var Serialization = require('../lib/utility/Serialization.js');
*/

var GraphUtilities = require('../lib/utility/GraphUtilities');

var KnexHelper = require('../lib/utility/KnexHelper.js');
var WorkflowEngine = require('../lib/algorithm/WorkflowEngine.js');

/*
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

router.get('/', function (req, res, next) {
    addVertex(req, res);
});
*/

router.get('/getgraph', function (req, res, next) {

    var graph = GraphUtilities.getGraph(req, res);

    var v = graph.getVertices();

    var kh = new KnexHelper();


    for (var i = 0; i < v.length; i++) {
        console.log('Adding table ' + v[i].instance);

        // get the keys to display, passing in the vertex's keys to exclude

        kh.addTable(v[i]);
    }
});

router.get('/runWorkflow', async function (req, res, next) {

    var graph = GraphUtilities.getGraph(req, res);

    GraphUtilities.inflate(graph);

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

});

module.exports = router;
