/**
 * CodeGenerator.js
 * @author Andrew
 */
let Graph = require('../graph/Graph.js');

function CodeGenerator(options) {

    let self = this;

    self.graph = options.graph;

    self.code = '';

    self.generateCode = function () {

        let vertex = self.getOutputVertex(self.graph);

        recurse(vertex);

        return self.code;
    };

    var recurse = function(vertex) {
        let edges = self.graph.getEdgesTo(vertex);

        for (let i in edges) {

            let child = self.graph.getVertexById(edges[i].sourceId);

            recurse(child);
        }

        self.code += vertex.type + '->';
    };

    self.getOutputVertex = function (graph) {
        let vertices = graph.getVertices();

        let ret = null;

        // look for the OutputControl
        vertices.forEach(function (v) {
            if (v.type === 'OutputControl') {
                ret = v;
            }
        });

        return ret;
    }
};

module.exports = CodeGenerator;