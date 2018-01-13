/**
 * CodeGenerator.js
 * @author Andrew
 */
let Graph = require('../graph/Graph.js');
let GraphUtilities = require('../utility/GraphUtilities.js');

function CodeGenerator(options) {

    let self = this;

    self.graph = options.graph;

    self.code = 
`
from pyspark.sql import SQLContext
from pyspark import SparkContext

sparkContext = SparkContext('local', 'mServer')
sparkContext.setLogLevel('ERROR')

sqlContext = SQLContext(sparkContext)

`;

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
                    self.code += 
`df = sqlContext.read.format('com.databricks.spark.xml'). \\
    option('rowTag', '${vertex.rootPath}'). \\
    load('${vertex.path}')`;
                    break;

                case 'FilterProperties':
                    self.code += `df = df.select(${vertex.filterProperties.map(str => `'${str}'`).join(', ')})`;
                    break;

                case 'OutputControl':
                    self.code += `print(df.collect())`;
                    break;

                case 'FunctionControl':
                    switch (vertex.instance) {
                        case 'ToLowerCase':
                        self.code += 'df = df.toDF(*[c.lower() for c in df.columns])';
                        break;
                        case 'ToUpperCase':
                        self.code += 'df = df.toDF(*[c.upper() for c in df.columns])';
                        break;
                    }
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
    };
};

module.exports = CodeGenerator;