// @author Andrew

define(['javascripts/source/control/Connector',
    'javascripts/source/model/Contracts',
    'javascripts/source/accordion/ControlBasePane',
    'javascripts/source/control/CSVFileControl',
    'javascripts/source/accordion/EntityControlPane',
    'javascripts/source/control/FormControl',
    'javascripts/source/control/FunctionControl',
    'javascripts/source/graph/Graph',
    'javascripts/source/control/JSONFileControl',
    'javascripts/source/control/LogicalEntityControl',
    'javascripts/source/control/OutputControl',
    'javascripts/source/accordion/OutputControlPane',
    'javascripts/source/control/PhysicalEntityControl',
    'javascripts/source/control/SplitterControl',
    'javascripts/source/control/user/UDFControl',
    'javascripts/source/control/user/UDFInControl',
    'javascripts/source/control/user/UDFOutControl',
    'javascripts/source/accordion/VertexControlPane',
    'javascripts/source/control/XMLFileControl'
    ],
    function (Connector,
        Contracts,
        ControlBasePane,
        CSVFileControl,
        EntityControlPane,
        FormControl,
        FunctionControl,
        Graph,
        JSONFileControl,
        LogicalEntityControl,
        OutputControl,
        OutputControlPane,
        PhysicalEntityControl,
        SplitterControl,
        UDFControl,
        UDFInControl,
        UDFOutControl,
        VertexControlPane,
        XMLFileControl) {

        'use strict';

        var ControlLibrary = function ControlLibrary() {

            var self = this;

            var graph = null;

            var create = function () {

                graph = new Graph();

                var objectKeys = _.difference(Object.keys(self), ['Association', 'DataFlow']);

                for (var i = 0; i < objectKeys.length; i++) {

                    graph.addVertex({ id: i, type: objectKeys[i] });
                }

                for (i = 0; i < objectKeys.length; i++) {

                    // get the parent object name
                    var child = graph.getVertexById(i);

                    var childGraphData = self[child.type].gd;

                    var parentType = null;
                    // TODO: need to understand splitter control better
                    if (typeof (childGraphData.instance) !== 'undefined' && childGraphData.instance !== 'SplitterControl') {
                        // if we have an instance, then the parent is the type
                        parentType = childGraphData.type;
                    } else {
                        // else the parent is the parent
                        parentType = childGraphData.parent;
                    }

                    // now find the index of the parentType
                    // Control base has undefined parent (gotta stop somewhere)
                    if (typeof (parentType) !== 'undefined') {

                        var index = _.indexOf(objectKeys, parentType);

                        var parent = graph.getVertexById(index);

                        graph.addEdge(child, parent, { name: 'Inheritance', type: 'Generalization' });
                    }

                }

                // now use this information to set the inheritance path and accordion panes
                var vertices = graph.getVertices();

                for (i = 0; i < vertices.length; i++) {
                    // console.log(vertices[i].type);

                    var libraryEntry = self[vertices[i].type];

                    libraryEntry.inheritancePath = getLineage(vertices[i]);
                    // console.log(self[vertices[i].type].inheritancePath);

                    for (var j = 0; j < libraryEntry.inheritancePath.length; j++) {
                        // get any accordion pane and add the type specific
                        libraryEntry.allAccordionPanes.push.apply(libraryEntry.allAccordionPanes,
                            self[libraryEntry.inheritancePath[j]].typeSpecificPanes);
                    }
                }
            };

            var getLineage = function (vertex) {

                var myPath = [];

                var Recurse = function (vertex) {

                    var edges = graph.getEdgesFrom(vertex);

                    for (var i in edges) {

                        Recurse(graph.getVertexById(edges[i][0].targetId));
                    }
                    myPath.push(vertex.type);
                };

                Recurse(vertex);

                return myPath;
            };

            self.ControlBase = {
                inheritancePath: [],
                typeSpecificPanes: [ControlBasePane],
                allAccordionPanes: [],
                gd: {
                    type: 'ControlBase',
                    parent: undefined
                }
            };

            self.VertexControl = {
                inheritancePath: [],
                typeSpecificPanes: [VertexControlPane],
                allAccordionPanes: [],
                gd: {
                    type: 'VertexControl',
                    parent: 'ControlBase'
                }
            };

            self.EntityControl = {
                inheritancePath: [],
                typeSpecificPanes: [EntityControlPane],
                allAccordionPanes: [],
                gd: {
                    type: 'EntityControl',
                    parent: 'VertexControl'
                }
            };

            self.UDFControl = {
                contracts: Contracts.UDFControl,
                ctor: UDFControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'UDFControl',
                    parent: 'EntityControl',
                    displayKeys: [],
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.UDFInControl = {
                contracts: Contracts.UDFControl,
                ctor: UDFInControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'UDFInControl',
 //                   instance: 'In',
                    parent: 'EntityControl',
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.UDFOutControl = {
                contracts: Contracts.UDFControl,
                ctor: UDFOutControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'UDFOutControl',
 //                   instance: 'Out',
                    parent: 'EntityControl',
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.FormControl = {
                contracts: Contracts.FormControl,
                ctor: FormControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FormControl',
                    parent: 'VertexControl',
                    inboundType: 'void',
                    outboundType: 'o'
                }
            };

            self.FunctionControl = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    parent: 'EntityControl'
                }
            };

            self.OutputControl = {
                contracts: Contracts.OutputControl,
                ctor: OutputControl,
                inheritancePath: [],
                typeSpecificPanes: [OutputControlPane],
                allAccordionPanes: [],
                gd: {
                    type: 'OutputControl',
                    parent: 'VertexControl'
                }
            };

            self.EditBox = {
                contracts: Contracts.FormControl,
                ctor: FormControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FormControl',
                    instance: 'EditBox',
                    inboundType: 'void',
                    outboundType: 'o'
                }
            };

            self.FindIndex = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'FindIndex',
                    func: _.findIndex,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            let distinct = function (aro, key) {
                let ret = [];
                for (let out of _.uniq(_.pluck(aro, key))) {
                    let t = {};
                    t[key] = out;
                    ret.push(t);
                }
                return ret;
            };

            self.Distinct = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'Distinct',
                    func: distinct,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.First = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'First',
                    func: _.first,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.Last = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'Last',
                    func: _.last,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.Pluck = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'Pluck',
                    func: _.pluck,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.Unique = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'Unique',
                    func: _.uniq,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.UniqueId = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'UniqueId',
                    func: _.uniqueId,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.Values = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'Values',
                    func: _.values,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.Sample = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'Sample',
                    func: _.sample,
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.Merge = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    func: function (aro, aro2) {
                        let ret = [];

                        for (let i = 0; i < aro.length; i++) {
                            ret.push(Object.assign(aro[i], aro2[i]));
                        }
                        return ret;
                    },
                    type: 'FunctionControl',
                    instance: 'Merge',
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.ToLower = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'ToLower', 
                    func: function (aro) {
                        return aro.map((x) => {
                            let obj = {};
                            obj[Object.keys(x)[0]] = Object.values(x)[0].toLowerCase();
                            return obj;
                        })
                    },
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.ToUpper = {
                contracts: Contracts.FunctionControl,
                ctor: FunctionControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FunctionControl',
                    instance: 'ToUpper', 
                    func: function (aro) {
                        return aro.map((x) => {
                            let obj = {};
                            obj[Object.keys(x)[0]] = Object.values(x)[0].toUpperCase();
                            return obj;
                        })
                    },
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.LogicalEntityControl = {
                contracts: Contracts.LogicalEntityControl,
                ctor: LogicalEntityControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'LogicalEntityControl',
                    parent: 'EntityControl'
                    // instance: 'New'
                }
            };

            self.PhysicalEntityControl = {
                contracts: Contracts.PhysicalEntityControl,
                ctor: PhysicalEntityControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'PhysicalEntityControl',
                    parent: 'EntityControl',
                    inboundType: 'void',
                    outboundType: 'aro'
                }
            };

            self.SplitterControl = {
                contracts: Contracts.SplitterControl,
                ctor: SplitterControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'SplitterControl',
                    parent: 'EntityControl',
                    instance: 'SplitterControl',
                    inboundType: 'aro',
                    outboundType: 'aro'
                }
            };

            self.CSVFileControl = {
                contracts: Contracts.CSVFileControl,
                ctor: CSVFileControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'CSVFileControl',
                    parent: 'EntityControl',
                    sourceName: '',
                    inboundType: 'void',
                    outboundType: 'aro'
                }
            };

            self.JSONFileControl = {
                contracts: Contracts.JSONFileControl,
                ctor: JSONFileControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'JSONFileControl',
                    parent: 'EntityControl',
                    sourceName: '',
                    inboundType: 'void',
                    outboundType: 'aro'
                }
            };

            self.XMLFileControl = {
                contracts: Contracts.XMLFileControl,
                ctor: XMLFileControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'XMLFileControl',
                    parent: 'EntityControl',
                    sourceName: '',
                    inboundType: 'void',
                    outboundType: 'aro'
                }
            };

            self.Grid = {
                contracts: Contracts.OutputControl,
                ctor: OutputControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'OutputControl',
                    instance: 'Grid',
                    imageName: 'images/Grid.png',
                    inboundType: 'aro',
                    outboundType: 'void'
                }
            };

            self.CSVFile = {
                contracts: Contracts.OutputControl,
                ctor: OutputControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'OutputControl',
                    instance: 'CSVFile',
                    imageName: 'images/CSVFile.png',
                    inboundType: 'aro',
                    outboundType: 'void'
                }
            };

            self.JSONFile = {
                contracts: Contracts.OutputControl,
                ctor: OutputControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'OutputControl',
                    instance: 'JSONFile',
                    imageName: 'images/JSONFile.png',
                    inboundType: 'aro',
                    outboundType: 'void'
                }
            };

            self.DataFlow = {
                contracts: Contracts.DataFlow,
                ctor: Connector,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    instance: 'Connector',
                    type: 'DataFlow'
                }
            };

            self.Association = {
                contracts: Contracts.Association,
                ctor: Connector,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    instance: 'Connector',
                    type: 'Association'
                }
            };

            create();

        };

        return ControlLibrary;
    });