var express = require('express');
var router = express.Router();

var GraphUtilities = require('../lib/utility/GraphUtilities');
var KnexHelper = require('../lib/utility/KnexHelper.js');
var WorkflowEngine = require('../lib/algorithm/WorkflowEngine.js');

/* TODO: Move this into the model table creation code when that's started...
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
*/

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
