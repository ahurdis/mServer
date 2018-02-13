const Graph = require('../graph/Graph.js');

const clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};

const meld = function (parent, child, udfControl) {
    var nodeMap = {};

    var udfInputControl, udfOutputControl;

    for (let vertex of child.getVertices()) {

        let state = clone(vertex.getState());

        nodeMap[state.id] = parent.nextNodeId;

        delete state.id;

        var newVertex = parent.addVertex(state);

        switch (newVertex.type) {
            case 'UDFInput':
                udfInputControl = newVertex;
                break;
            case 'UDFOutput':
                udfOutputControl = newVertex;
                break;
        }
    }

    for (let edge of child.getAllEdges()) {

        let state = clone(edge.getState());

        delete state.id;

        var sourceId = state.sourceId;
        var targetId = state.targetId;

        state.sourceId = nodeMap[sourceId];
        state.targetId = nodeMap[targetId];

        parent.addEdge(parent.getVertexById(nodeMap[sourceId]),
            parent.getVertexById(nodeMap[targetId]),
            state);
    }

    for (let edgeTo of parent.getEdgesTo(udfControl)) {

        let state = clone(edgeTo.getState());

        // get the vertex upstream from the udfControl
        var upstreamVertex = parent.getVertexById(state.sourceId);

        delete state.id;
        delete state.sourceId;
        delete state.targetId;

        parent.addEdge(upstreamVertex, udfInputControl, state);
    }

    var edgesFrom = parent.getEdgesFrom(udfControl);

    for (let i in edgesFrom) {

        for (let edge of edgesFrom[i]) {

            let state = clone(edge.getState());

            // get the vertex downstream from the udfControl
            var downstreamVertex = parent.getVertexById(state.targetId);

            delete state.id;
            delete state.sourceId;
            delete state.targetId;

            parent.addEdge(udfOutputControl, downstreamVertex, state);
        }
    }

    parent.removeVertex(udfControl);
};

try {
    let parent = new Graph();
    let vertex1 = parent.addVertex({ name: 'One', type: 'Input' });
    let udfControl = parent.addVertex({ name: 'Two', type: 'UDFControl' });
    let vertex3 = parent.addVertex({ name: 'Three', type: 'Output' });
    let vertex4 = parent.addVertex({ name: 'Four', type: 'Output' });
    parent.addEdge(vertex1, udfControl, { name: 'Co-developed Google and Microsoft product', type: 'Partnership' });
    parent.addEdge(udfControl, vertex3, { name: 'Google', cardinality: '0..1', type: 'Partnership' });
    parent.addEdge(udfControl, vertex4, { name: 'Google', cardinality: '0..1', type: 'Partnership' });

    let child = new Graph();
    let vertexA = child.addVertex({ name: 'A', type: 'UDFInput' });
    let vertexB = child.addVertex({ name: 'B', type: 'DoIt' });
    let vertexC = child.addVertex({ name: 'B', type: 'UDFOutput' });
    child.addEdge(vertexA, vertexB, { name: 'Linker' });
    child.addEdge(vertexB, vertexC, { name: 'Linker' });

    // meld(parent, child, udfControl);

    console.log(parent.toJSON());
}

catch (e) {
    console.dir(e);
}
