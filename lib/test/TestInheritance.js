var Graph = require('../graph/Graph.js');
var GraphData = require('../graph/GraphData.js');

var deepCopy = function (obj) {
    return JSON.parse(JSON.stringify(obj))
};

var deepCopy2 = function (o) {
    var copy = Object.create(Object.getPrototypeOf(o));
    var propNames = Object.getOwnPropertyNames(o);
    
    propNames.forEach(function (name) {
        var desc = Object.getOwnPropertyDescriptor(o, name);
        Object.defineProperty(copy, name, desc);
    });
    return copy;
};

var Merge = function () {
    var obj = {},
        i = 0,
        il = arguments.length,
        key;
    for (; i < il; i++) {
        for (key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                obj[key] = arguments[i][key];
            }
        }
    }
    return obj;
};

var graph = new Graph();

var InheritProperties = function (vertex) {
    
    var edges = graph.getAllEdges();
    
    var objMerge = {};
    
    var Recurse = function (vertex) {
        for (var i in edges) {
            if (edges[i].source.id === vertex.id && edges[i].type === 'Generalization') {
                Recurse(graph.getVertexById(edges[i].targetId));
            }
        }
        objMerge = Merge(objMerge, vertex.getState());
    };
    
    Recurse(vertex);

    return objMerge;
};

try {
  //  console.log(merge(p.getState(), c.getState()));

    var grandparent = graph.addVertex({ id: 1, name: 'Parent', type: 'GrandParent', gps: 'Ancient' });
    var dad = graph.addVertex({ id: 1, name: 'Parent', type: 'Parent', dparents: 'Dad' });
    var mom = graph.addVertex({ id: 1, name: 'Parent', type: 'Parent', mparents: 'Mom' });
    var child = graph.addVertex({ id: 2, name: 'Child', type: 'Child', somethingChildish: 'Crying' });
    
    graph.addEdge(child, dad, { id: 1, name: 'Inheritance', type: 'Generalization' });
    graph.addEdge(child, mom, { id: 1, name: 'Inheritance', type: 'Generalization' });
    graph.addEdge(dad, grandparent, { id: 1, name: 'Inheritance', type: 'Generalization' });
    
    console.log(InheritProperties(child));
    
//    console.log('The graph has this many nodes in it:');
    /*
    var copy = deepCopy(graph);
    console.log(copy.count());
    */
}
catch (e) {
    console.log(e);
}

