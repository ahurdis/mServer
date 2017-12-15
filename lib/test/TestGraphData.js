
var GraphData = require('../graph/GraphData.js');

try
{
    var graphData = new GraphData({ id: 1, name: 'Google', type: 'Attribute', another : 'Random' });

    // Get a property from GraphData that has been mixed in to Vertex
    console.log(graphData.type);
    graphData.type = 'Monkey';
    console.log(graphData.type);
    console.log(graphData.another);
    
    graphData.description = 'A silly monkey.';

    console.log(graphData.description);
}
catch (e)
{
    prompts.write(e);
}
