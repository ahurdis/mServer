/**
 * CodeGenerator.js
 * @author Andrew
 */

let CommonTags = require('common-tags');
let Graph = require('../graph/Graph.js');
let GraphUtilities = require('../utility/GraphUtilities.js');
let MultiMap = require('../algorithm/MultiMap.js');

function CodeGenerator(options) {

    let self = this;

    let graph = options.graph;
    let code = '';
    let variables = {};
    let importMap = new MultiMap();
    let contextSet = new Set();

    self.generateCode = function () {

        try {

            importMap.add(`pyspark.sql`, `SQLContext`)
                        .add(`pyspark`, `SparkContext`);

            contextSet.add(`sparkContext = SparkContext('local', 'mServer')`)
                        .add(`sparkContext.setLogLevel('ERROR')`)
                        .add(`sqlContext = SQLContext(sparkContext)`);

            let allVertices = graph.getVertices();

            for (let vertex of allVertices) {
                graph.addVertexProperty(vertex, 'varName', getVariableName(vertex));
            }

            let outputVertices = GraphUtilities.getOutputVertices(graph);

            for (let vertex of outputVertices) {
                recurse(vertex);
            }

            let strImport = getImportCode() + '\n';
            let strContext = [...contextSet].join('\n') + '\n\r';

            return strImport + strContext + code;
        }
        catch (e) {
            console.dir(e);
        }
    };

    let getImportCode = () => {
        
        let ret = '';
        
        for (let key of importMap.keys()) {
            let distinctValues = new Set(importMap.get(key));
            ret += `from ${key} import ${[...distinctValues].join(', ')}` + '\n';
        }

        return ret;
    };

    let getVariableName = (vertex) => {

        try {
            let vertexInstance = vertex.instance;
            let vertexInstanceCount = 0;
            let variableName = vertexInstance.replace(' ', '') + vertexInstanceCount;

            while (Object.keys(variables).includes(variableName)) {
                vertexInstanceCount++;
                variableName = vertexInstance.replace(' ', '') + vertexInstanceCount;
            }

            variables[variableName] = vertex;
            return variableName;
        }
        catch (e) {
            console.dir(e);
        }
    };

    let getCode = (vertex) => {

        try {
            // the names of vertices upstream from me
            let upNames = [];

            if (vertex) {

                // get the names of the input vertices
                for (let upstreamEdge of graph.getEdgesTo(vertex)) {
                    upNames.push(graph.getVertexById(upstreamEdge.sourceId).varName);
                }

                switch (vertex.type) {

                    case 'XMLFileControl':
                        code += CommonTags.stripIndent`
                        ${vertex.varName} = sqlContext.read.format('com.databricks.spark.xml'). \\
                            option('rowTag', '${vertex.rootPath.split('.').pop()}'). \\
                            load('${vertex.path}')`;
                        break;

                    case 'FilterProperties':
                        if (vertex.filterProperties && vertex.filterProperties.length > 0) {
                            code += `${vertex.varName} = ${upNames[0]}.select(${vertex.filterProperties.map(str => `'${str}'`).join(', ')})`;
                        }
                        break;

                    case 'OutputControl':
                        code += `${vertex.varName}.show()`;
                        break;

                    case 'FunctionControl':
                        switch (vertex.instance) {
                            case 'ToLower':
                                importMap.add(`pyspark.sql.functions`, `col`);
                                importMap.add(`pyspark.sql.functions`, `lower`);
                                code += `${vertex.varName} = ${upNames[0]}.select(*[lower(col(c)).alias(c) for c in ${upNames[0]}.columns])`;
                                break;
                            case 'ToUpper':
                                importMap.add(`pyspark.sql.functions`, `col`);
                                importMap.add(`pyspark.sql.functions`, `upper`);
                                code += `${vertex.varName} = ${upNames[0]}.select(*[upper(col(c)).alias(c) for c in ${upNames[0]}.columns])`;
                                break;
                            case 'Merge':
                                importMap.add(`pyspark.sql.functions`, `monotonically_increasing_id`);
                                code += CommonTags.stripIndent`
                                    ${vertex.varName}Temp1 = ${upNames[0]}.withColumn("id", monotonically_increasing_id())
                                    ${vertex.varName}Temp2 = ${upNames[1]}.withColumn("id", monotonically_increasing_id())
                                    ${vertex.varName} = ${vertex.varName}Temp2.join(${vertex.varName}Temp1, "id", "outer").drop("id")`;
                                break;
                        }
                        break;
                }
                code += '\n\r';
            }
        }
        catch (e) {
            console.dir(e);
        }
    };

    let recurse = (vertex) => {

        try {
            let edges = graph.getEdgesTo(vertex);

            for (let i in edges) {

                let child = graph.getVertexById(edges[i].sourceId);

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