/**
 * CodeGenerator.js
 * @author Andrew
 */

let CommonTags = require('common-tags');
let Graph = require('../graph/Graph.js');
let GraphUtilities = require('../utility/GraphUtilities.js');

function CodeGenerator(options) {

    let self = this;

    self.graph = options.graph;

    self.code = CommonTags.stripIndent`
                    from pyspark.sql import SQLContext
                    from pyspark import SparkContext

                    sparkContext = SparkContext('local', 'mServer')
                    sparkContext.setLogLevel('ERROR')

                    sqlContext = SQLContext(sparkContext)`;

    self.code += '\n\r';

    self.count = 0;

    self.generateCode = function () {

        let vertices = GraphUtilities.getOutputVertices(self.graph);

        for (let vertex of vertices) {
            recurse(vertex);
        }

        return self.code;
    };

    let getCode = function (vertex) {

        try {

            let strCode = '';
            let varName = self.variableStack[0];
            let varName1 = self.variableStack[1];
            let varName2 = self.variableStack[2];

            if (vertex) {
                switch (vertex.type) {

                    case 'XMLFileControl':
                        self.code += CommonTags.stripIndent`
                        ${varName} = sqlContext.read.format('com.databricks.spark.xml'). \\
                            option('rowTag', '${vertex.rootPath.split('.').pop()}'). \\
                            load('${vertex.path}')`;
                        break;

                    case 'FilterProperties':
                        if (vertex.filterProperties && vertex.filterProperties.length > 0) {
                            self.code += `${varName} = ${varName}.select(${vertex.filterProperties.map(str => `'${str}'`).join(', ')})`;
                        }
                        break;

                    case 'OutputControl':
                        self.code += `${varName}.show()`;
                        break;

                    case 'FunctionControl':
                        switch (vertex.instance) {
                            case 'ToLowerCase':
                                self.code += `${varName} = ${varName}.toDF(*[c.lower() for c in ${varName}.columns])`;
                                break;
                            case 'ToUpperCase':
                                self.code += `${varName} = ${varName}.toDF(*[c.upper() for c in ${varName}.columns])`;
                                break;
                            case 'Join':
                                self.code += `${varName} = ${varName1} joined to ${varName2}`;
                            break;
                        }
                        break;
                }
                self.code += '\n\r';
            }
        }
        catch (e) {
            console.dir(e);
        }
    };

    let outboundControls = ['CSVFileControl', 'JSONFileControl', 'XMLFileControl', 'PhysicalEntityControl'];

    self.variableStack = [];

    let recurse = function (vertex) {
        try {
            let edges = self.graph.getEdgesTo(vertex);

            if (outboundControls.includes(vertex.type)) {

                for (let edge in self.graph.getEdgesFrom(vertex)) {
                    self.variableStack.push(`df${vertex.instance.replace(' ', '')}${self.count++}`);
                }
            }

            for (let i in edges) {

                let child = self.graph.getVertexById(edges[i].sourceId);

                if (child.visited === undefined || child.visited === false) {
                    recurse(child);
                }
            }

            if (vertex.type === 'FunctionControl' && edges.length > 1) {
                self.variableStack = self.variableStack.slice(1, edges.length);
                getCode(vertex);
                self.variableStack.push(`df${vertex.instance.replace(' ', '')}${self.count++}`);
            } else {
                getCode(vertex);
            }


            vertex.visited = true;
        }
        catch (e) {
            console.dir(e);
        }
    };
};

module.exports = CodeGenerator;