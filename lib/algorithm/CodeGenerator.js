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

    let variables = {};

    self.generateCode = function () {

        let allVertices = self.graph.getVertices();

        for (let vertex of allVertices) {
            self.graph.addVertexProperty(vertex, 'variableName', getVariableName(vertex));
        }

        let outputVertices = GraphUtilities.getOutputVertices(self.graph);

        for (let vertex of outputVertices) {
            recurse(vertex);
        }

        return self.code;
    };
    
    let outboundControls = ['CSVFileControl', 'JSONFileControl', 'XMLFileControl', 'PhysicalEntityControl'];

    var getVariableName = (vertex) => {
        let vertexInstance = vertex.instance;
        let vertexInstanceCount = 0;
        let variableName = vertexInstance.replace(' ','') + vertexInstanceCount;
        while (Object.keys(variables).includes(variableName)) {
            vertexInstanceCount++;
            variableName = vertexInstance.replace(' ','') + vertexInstanceCount;
        }

        variables[variableName] = vertex;
        return variableName;
    };

    let getCode = (vertex) => {

        try {

            let strCode = '';
            let upstreamNames = [];

            if (vertex) {

                // get the names of the input vertices
                for (let upstreamEdge of self.graph.getEdgesTo(vertex)) {
                    upstreamNames.push(self.graph.getVertexById(upstreamEdge.sourceId).variableName);
                }

                switch (vertex.type) {

                    case 'XMLFileControl':
                        self.code += CommonTags.stripIndent`
                        ${vertex.variableName} = sqlContext.read.format('com.databricks.spark.xml'). \\
                            option('rowTag', '${vertex.rootPath.split('.').pop()}'). \\
                            load('${vertex.path}')`;
                        break;

                    case 'FilterProperties':
                        if (vertex.filterProperties && vertex.filterProperties.length > 0) {
                            self.code += `${vertex.variableName} = ${upstreamNames[0]}.select(${vertex.filterProperties.map(str => `'${str}'`).join(', ')})`;
                        }
                        break;

                    case 'OutputControl':
                        self.code += `${vertex.variableName}.show()`;
                        break;

                    case 'FunctionControl':
                        switch (vertex.instance) {
                            case 'ToLowerCase':
                                self.code += `${vertex.variableName} = ${upstreamNames[0]}.toDF(*[c.lower() for c in ${upstreamNames[0]}.columns])`;
                                break;
                            case 'ToUpperCase':
                                self.code += `${vertex.variableName} = ${upstreamNames[0]}.toDF(*[c.upper() for c in ${upstreamNames[0]}.columns])`;
                                break;
                            case 'Join':
                                self.code += `${vertex.variableName} = ${upstreamNames[0]} joined to ${upstreamNames[1]}`;
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


    let recurse = (vertex) => {
        try {
            let edges = self.graph.getEdgesTo(vertex);
            
            for (let i in edges) {

                let child = self.graph.getVertexById(edges[i].sourceId);

                if (child.visited === undefined || child.visited === false) {
                    recurse(child);
                }
            }

            getCode(vertex);

            vertex.visited = true;
        }
        catch (e) {
            console.dir(e);
        }
    };
};

module.exports = CodeGenerator;