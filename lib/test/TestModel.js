var readline = require('readline');

var Model = require('../model/Model.js');

var prompts = readline.createInterface(process.stdin, process.stdout);

var TestRecursion = function(graph) {

    var edges = graph.getAllEdges();

    var Recurse = function(vertex)
    {
        var hasPredecessors = false;

        for (var i in edges) {
            if (edges[i].targetId === vertex.id) {
                hasPredecessors = true;
                Recurse(graph.getVertexById(edges[i].sourceId));
            }
        }

        console.log('System Name: ' + vertex.name);


        var myEdges = graph.getEdges(vertex);

        hasPredecessors === false ? crud = 'C' : crud = 'R';
        
        for (var i in myEdges)
        {
            if (typeof(graph.getVertexById(myEdges[i].targetId)) !== 'undefined')
            {
                console.log('-' + crud + '-' + graph.getVertexById(myEdges[i].targetId).name + ' - ' + myEdges[i].targetId);
            }
        }
    };

    // find the root
    if (graph.IsEmpty() === false)
    {
        // pick a vertex "at random" - we've confirmed there is a zeroth element
        var vertex = graph.getVertices()[0];

        Recurse(vertex);
    }
};

try
{
    var m = new Model();

    var graph = m.GetGraph();

    TestRecursion(graph);
}
catch (e)
{
    prompts.write(e);
}

prompts.question("Hit Enter to exit...", function() {
    process.exit();
});
