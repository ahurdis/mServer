/**
 * CodeGenerator.js
 * @author Andrew
 */
let Graph = require('../graph/Graph.js');
let GraphUtilities = require('../utility/GraphUtilities.js');

function CodeGenerator(options) {

    let self = this;

    self.graph = options.graph;

    self.code = '';

    self.generateCode = function () {

        let vertex = GraphUtilities.getOutputVertex(self.graph);

        recurse(vertex);

        return self.code;
    };

    var getCode = function (vertex) {

        let strCode = '';

        if (vertex) {
            switch (vertex.type) {

                case 'XMLFileControl':
                    self.code += `df = sqlContext.read.format('com.databricks.spark.xml'). \\
                                    option('rowTag', '${vertex.rootPath}'). \\
                                    load('${vertex.path}')`;
                    break;

                case 'FilterProperties':
                    self.code += `df = df.select(${vertex.filterProperties.map(str => `'${str}'`).toString()});`;
                    break;

                case 'OutputControl':
                    self.code += `print(df.collect())`;
                    break;
            }
            self.code += '\n\r';
        }
    };

    var recurse = function (vertex) {
        let edges = self.graph.getEdgesTo(vertex);

        for (let i in edges) {

            let child = self.graph.getVertexById(edges[i].sourceId);

            recurse(child);
        }

        getCode(vertex);

        // self.code += vertex.type + '->';
    };
};

module.exports = CodeGenerator;