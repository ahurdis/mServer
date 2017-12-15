// @author Andrew

define(['javascripts/source/control/Connector',
    'javascripts/source/model/Contracts',
    'javascripts/source/accordion/ControlBasePane',
    'javascripts/source/control/FileControl',
    'javascripts/source/control/FormControl',
    'javascripts/source/control/FunctionControl',
    'javascripts/source/graph/Graph',
    'javascripts/source/control/LogicalEntityControl',
    'javascripts/source/control/OutputControl',
    'javascripts/source/accordion/OutputControlPane',
    'javascripts/source/control/PhysicalEntityControl',
    'javascripts/source/accordion/VertexControlPane'],
    function (Connector,
        Contracts,
        ControlBasePane,
        FileControl,
        FormControl,
        FunctionControl,
        Graph,
        LogicalEntityControl,
        OutputControl,
        OutputControlPane,
        PhysicalEntityControl,
        VertexControlPane) {

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
                    if (typeof (childGraphData.instance) !== 'undefined') {
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

                    var edges = graph.getEdges(vertex);

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
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'EntityControl',
                    parent: 'VertexControl'
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


            var distinct = function (obj, key) {
                return _.uniq(obj, (o) => {

                    return o[key];
                });
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

            self.FileControl = {
                contracts: Contracts.FileControl,
                ctor: FileControl,
                inheritancePath: [],
                typeSpecificPanes: [],
                allAccordionPanes: [],
                gd: {
                    type: 'FileControl',
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