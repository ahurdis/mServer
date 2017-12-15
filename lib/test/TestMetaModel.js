
var readline = require('readline');

var MetaModel = require('../meta/MetaModel.js');

var Cardinality = require('../meta/Cardinality.js');

var prompts = readline.createInterface(process.stdin, process.stdout);

try
{
    var mm = new MetaModel();

    var graph = mm.GetGraph();

    // build a Model as a test case


    // Run additional tests
    console.log('The graph has this many nodes in it:');
    console.log(graph.count());

    console.log('All Edges');
    var edges = graph.getAllEdges();
    for (var i in edges)
    {
        console.log(edges[i].cardinality);

        if (edges[i].cardinality == Cardinality.ONE_MANY)
        {
            console.log('bingo!');
        }
    }
}
catch (e)
{
    prompts.write(e);
}

prompts.question("Hit Enter to exit...", function() {
    process.exit();
});
