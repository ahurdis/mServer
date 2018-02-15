
define([
    'javascripts/source/accordion/AccordionManager',
    'javascripts/source/utility/ColorUtil',
    'javascripts/source/app/ControlLibrary',
    'javascripts/source/canvas/EntityCanvas',
    'javascripts/source/graph/Graph',
    'javascripts/source/graph/GraphData',
    'javascripts/source/graph/GraphFactory',
    'javascripts/source/graph/GraphStorage',
    'javascripts/source/utility/ObjectProperties',
    'javascripts/source/utility/RestHelper',
    'javascripts/source/app/TabManager',
    'javascripts/source/utility/TextFileReader',
    'javascripts/source/app/TreeManager',
    'javascripts/source/document/UDFDocument',
    'javascripts/source/document/UserDocument'],
    function (AccordionManager, ColorUtil, ControlLibrary, EntityCanvas,
        Graph, GraphData, GraphFactory, GraphStorage,
        ObjectProperties, RestHelper, TabManager, 
        TextFileReader, TreeManager, UDFDocument, UserDocument) {

        'use strict';

        return function App(canvas, graph) {
            try {

                var self = this;

                var activeTabID = '';

                self.sourceSchema = {};

                self.selectedControl = null;

                self.userName = 'admin';

                /**
                 * Creates the app, called by this function.
                 */
                self.create = function () {

                    // alert(guid());
                    // initialize the control library
                    self.lib = new ControlLibrary();
                    // initialize the accordion manager
                    self.am = new AccordionManager();

                    self.tm = new TabManager();

                    self.constructors = {
                        'Graph': Graph,
                        'GraphData': GraphData
                    };

                    self.activeDocuments = [];

                    self.setDefaultColors('vader');

                    // populate the source tree with the user's schema data
                    self.updateSourceTree();
                };

                self.populateModelWithUserControls = function () {
                    GraphStorage.forAllDocuments((userDocument) => {
                        if (userDocument.type === 'UDF') {
                            new UDFDocument(userDocument).publishControl();
                        }
                    });
                };

                self.setDefaultColors = function (theme) {

                    var redmondTheme = function () {
                        self.borderColor = ColorUtil.color.darkslateblue;
                        self.fontColor = ColorUtil.color.slateblue;
                        self.selectionColor = ColorUtil.color.lightslategray;
                        self.fillStyle = ColorUtil.color.powderblue + '1F';
                        self.iconFillStyle = self.borderColor;
                    };

                    var sunnyTheme = function () {
                        self.borderColor = ColorUtil.color.darkseagreen;
                        self.fontColor = ColorUtil.color.seagreen;
                        self.selectionColor = ColorUtil.color.lightseagreen;
                        self.fillStyle = ColorUtil.color.powderblue + '1F';
                        self.iconFillStyle = self.borderColor;
                    };

                    var vaderTheme = function () {
                        self.borderColor = ColorUtil.color.powderblue;
                        self.fontColor = ColorUtil.color.ivory;
                        self.selectionColor = ColorUtil.color.blanchedalmond;
                        self.fillStyle = ColorUtil.color.powderblue + '1F';
                        self.iconFillStyle = self.borderColor;
                    };

                    switch (theme) {

                        case 'Redmond':
                            redmondTheme();
                            break;

                        case 'Sunny':
                            sunnyTheme();
                            break;

                        case 'Vader':
                            vaderTheme();
                            break;

                        default:
                            vaderTheme();
                            break;
                    }


                    /*
                    self.borderColor = document.getComputedStyle('ui-state-active').style.color;
                    self.fontColor = ColorUtil.rgbToHex($('.ui-widget-content').css('color'));
                    self.selectionColor = ColorUtil.rgbToHex($('.ui-widget-header').css('color'));
                    */
                };

                self.updateSourceTree = function () {

                    RestHelper.postJSON('fileSchemaCallback', {
                        method: 'sourceMetadata/fileSchema', data: {
                            userName: self.userName
                        }
                    },
                        function (result) {

                            var nodeName = '';
                            for (var i = 0, len = result.length; i < len; i++) {

                                switch (result[i].type) {
                                    case 'csv':
                                        nodeName = 'CSV File';
                                        break;
                                    case 'json':
                                        nodeName = 'JSON File';
                                        break;
                                    case 'xml':
                                        nodeName = 'XML File';
                                        break;
                                }

                                TreeManager.addFileSource(result[i], nodeName);
                                self.sourceSchema[result[i].sourceName] = result[i];
                            }

                            // console.log(result);
                        });

                    RestHelper.postJSON('databaseSchemaCallback', {
                        method: 'sourceMetadata/databaseSchema', data: {
                            userName: self.userName
                        }
                    },
                        function (result) {
                            // update the tree with the 
                            for (var i = 0, len = result.length; i < len; i++) {
                                TreeManager.addDatabaseSource(result[i].database, result[i]);
                                self.sourceSchema[result[i].database] = result[i];
                            }
                        });
                };

                self.updateMenu = function () {

                    //                 $('#workflow > ul').prop('class', 'menu');

                    //                 $('#workflow').menu('refresh');

                    /*
                                        var item = '<li><a href="#">Blurb</a></li>';
                    
                                        $('#edit > ul').append(item);
                    
                                        $('.menu').menu('refresh');
                    */
                };

                self.addNewUserDocument = function (graph, type, udfControl) {

                    var doc;

                    var tab = self.tm.addTab('New Document');

                    var options = {
                        tabID: tab.tabID,
                        canvasID: tab.canvasID,
                        type: type,
                        canvas: new EntityCanvas({
                            canvas: document.getElementById(tab.canvasID),
                            graph: graph
                        })
                    };

                    switch (type) {
                        case 'UDF':
                            options['udfControl'] = udfControl;
                            doc = new UDFDocument(options);
                            break;
                        default:
                            doc = new UserDocument(options);
                            break;
                    }
                    self.activeDocuments.push(doc);

                    return doc;
                };

                var addExistingUserDocument = function (userDocument, graph) {

                    var doc;
                    var tab = self.tm.addTab(userDocument.name);

                    userDocument.tabID = tab.tabID;
                    userDocument.canvasID = tab.canvasID;

                    userDocument.canvas = new EntityCanvas({
                        canvas: document.getElementById(tab.canvasID),
                        graph: graph,
                        userDocument: userDocument
                    });

                    switch (userDocument.type) {
                        case 'UDF':
                            doc = new UDFDocument(userDocument);
                            break;
                        default:
                            doc = new UserDocument(userDocument);
                            break;
                    }
                    self.activeDocuments.push(doc);
                };

                self.getUserDocumentFromCanvasID = function (canvasID) {

                    var index = _.findIndex(self.activeDocuments, { canvasID: canvasID });

                    return self.activeDocuments[index];
                };

                self.getUserDocumentFromTabID = function (tabID) {

                    var index = _.findIndex(self.activeDocuments, { tabID: tabID });

                    return self.activeDocuments[index];
                };

                self.getUserDocumentFromName = function (name) {

                    var index = _.findIndex(self.activeDocuments, { name: name });

                    return self.activeDocuments[index];
                };

                self.getTabIDFromUserDocument = function (userDocument) {
                    return userDocument.tabID;
                };

                self.getActiveDocument = function () {

                    return self.getUserDocumentFromTabID(activeTabID);
                };

                self.setActiveTabID = function (tabID) {
                    activeTabID = tabID;
                };

                self.updateColors = function (theme) {

                    self.setDefaultColors(theme);

                    for (var activeDocument of self.activeDocuments) {
                        activeDocument.updateDocumentColors();
                    }
                };

                self.menuSelect = function (menuItemText) {

                    switch (menuItemText) {
                        case 'New Model':

                            self.addNewUserDocument(GraphFactory.createSimpleEntityGraph(), 'Model');

                            break;

                        case 'New Workflow':

                            self.addNewUserDocument(new Graph(), 'Workflow');

                            break;

                        case 'Open':

                            self.openLocalStorageDialog();

                            break;

                        case 'Save':

                            var userDocument = self.getActiveDocument();

                            if (userDocument.name === 'New Document') {

                                self.saveLocalStorageDialog();

                            } else {

                                self.saveUserDocument(userDocument);
                            }

                            break;

                        case 'SaveAll':

                            alert('To be implemented.');

                            break;

                        case 'Close':

                            window.close();

                            break;

                        case 'Stuff':

                            //                           alert(".ui-widget-content" + $(".ui-widget-content").css("color"));

                            break;

                        default:

                            break;
                    }
                };

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
                            case 'UDFInControl':
                                udfInputControl = newVertex;
                                break;
                            case 'UDFOutControl':
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

                var getGraphByName = function (name) {

                    var ret = GraphStorage.getGraph(name);
    
                    // if not in storage, get it from active documents
                    if (!ret) {
                        var userDocument = app.getUserDocumentFromName(name);
                        ret = userDocument.getGraph();
                    }
                    return ret;
                };

                self.flattenGraph = function (graph) {
                    var vertices = graph.getVertices();

                    for (var vertex of vertices) {
                        if (vertex.type === 'UDFControl') {
                            var child = getGraphByName(vertex.instance);

                            meld(graph, child, vertex);
                        }
                    }
                    return graph;
                };

                self.runWorkflow = function () {

                    // get the active User document
                    var userDocument = self.getActiveDocument();

                    var graph = userDocument.getGraph();

                    var flattenedGraph = self.flattenGraph(graph.clone());

                    // determine if it is a workflow
                    if (userDocument && userDocument.type === 'Workflow') {
                        RestHelper.postJSON('runWorkflowCallback', { method: 'graphRoute/runWorkflow', timeout: 15000, data: flattenedGraph },
                            function (data) {
                                self.populateGrid(data);
                            });
                    } else {
                        alert('Please select a valid workflow.');
                    }
                };

                self.generateCode = function () {

                    // get the active User document
                    var userDocument = self.getActiveDocument();

                    var requestData = {
                        documentName: userDocument.name,
                        graph: userDocument.getGraph()
                    };

                    // determine if it is a workflow
                    if (userDocument && userDocument.type === 'Workflow') {
                        RestHelper.postJSON('generateCodeCallback', { method: 'generateCode/spark', timeout: 15000, data: requestData },
                            function (data) {
                                alert(data);
                            });
                    } else {
                        alert('Please select a valid workflow.');
                    }
                };

                /**
                 * Reads in a CSV source file.
                 * @param  {String []} files    The file array returned from the HTML input open file dialog.
                 */
                self.handleFiles = function (files) {
                    TextFileReader.handleFiles(files);
                };

                self.attributeArray = [];
                /**
                 * Reads in a CSV source file.
                 * @param  {String} file    The file path to be uploaded
                 */
                self.getHeader = function (file) {
                    TextFileReader.getHeader(file);
                };

                self.getJSONKeys = function (files) {
                    require(['javascripts/source/utility/JSONFileReader'],
                        function (JSONFileReader) {
                            JSONFileReader.handleFiles(files);
                        });
                };

                self.getXMLFragment = function (files) {
                    require(['javascripts/source/utility/XMLFileReader'],
                        function (XMLFileReader) {
                            var xmlFileReader = new XMLFileReader({ childrenAsArray: false });
                            xmlFileReader.handleFiles(files);
                        });
                };

                self.xmlFragment = '';

                self.saveUserDocument = function (userDocument) {

                    if (userDocument) {

                        // do user document save activities e.g. UDFDocument
                        userDocument.onSave();

                        var strJSON = JSON.stringify(userDocument);

                        if (typeof (Storage) !== 'undefined') {
                            localStorage.setItem(userDocument.name, strJSON);
                        }

                        GraphStorage.saveObject(userDocument.name, userDocument.canvas.graph());
                    }
                };

                self.addControlToLibrary = function (udfDocument) {

                    require(['javascripts/source/model/Contracts'],
                        function (Contracts) {

                            var displayKeys = [];

                            var userDocumentName = udfDocument.getControlName();

                            // get the displayKeys from the InputControl or from LocalStorage
                            if (udfDocument.udfControl && udfDocument.udfControl.inputControl) {
                                displayKeys = udfDocument.udfControl.inputControl.displayKeys;
                            } else {
                                var graph = GraphStorage.getGraph(userDocumentName);
                                if (graph) {
                                    var vertices = graph.getVertices();
                                    for (var i = 0; i < vertices.length; i++) {
                                        if (vertices[i].instance === 'In') {
                                            displayKeys = vertices[i].displayKeys;
                                        }
                                    }
                                }
                            }

                            self.lib[userDocumentName] = {
                                contracts: Contracts.UDFControl,
                                ctor: UDFControl,
                                inheritancePath: [],
                                typeSpecificPanes: [],
                                allAccordionPanes: [],
                                gd: {
                                    type: 'UDFControl',
                                    instance: userDocumentName,
                                    parent: 'EntityControl',
                                    displayKeys: displayKeys,
                                    outboundType: 'aro',
                                    inboundType: 'aro'
                                }
                            }
                        });
                };

                self.addControlIcon = function (userDocumentName) {

                    var userFunctionDIV = document.getElementById('UserFunctionID');
                    var figure = document.createElement('figure');

                    var img = document.createElement('img');
                    img.setAttribute('id', userDocumentName);
                    img.setAttribute('src', 'images/AddNode.png');
                    img.setAttribute('draggable', 'true');
                    img.setAttribute('ondragstart', 'drag(event);');

                    var figcaption = document.createElement('figcaption');
                    figcaption.innerHTML = userDocumentName;

                    figure.appendChild(img);
                    figure.appendChild(figcaption);

                    userFunctionDIV.appendChild(figure);
                };

                self.openUserDocument = function (key) {

                    var userDocument = null;

                    if (typeof (Storage) !== 'undefined') {

                        // Get back the array of vertex serializers
                        var strJSON = localStorage.getItem(key);

                        if (strJSON !== null) {
                            userDocument = JSON.parse(strJSON);
                            // now we get the graph
                            var graph = GraphStorage.loadObject(key + ' Graph');

                            addExistingUserDocument(userDocument, graph);
                        }
                    }
                    return userDocument;
                };

                /**
                 * Saves an graph to the LocalStorage
                 * @param  {string} key    The key for the object in LocalStorage.
                 * @param  {Graph} object    The object to store in LocalStorage.
                  */
                self.saveObject = function (key, object) {
                    GraphStorage.saveObject(key, object);
                };

                /**
                 * Loads a graph to the LocalStorage
                 * @param  {string} key    The key for the object in LocalStorage.
                 * @return {Graph}   The new entity canvas.
                 */
                self.loadObject = function (key) {
                    return GraphStorage.loadObject(key);
                };

                self.openMySQLConnectionDialog = function () {
                    require(['javascripts/source/dialogs/MySQLConnection'],
                        function (MySQLConnection) {
                            try {
                                var view = new MySQLConnection();
                                view.create();
                            }
                            catch (e) {
                                alert('index.html: MySQLConnection create ' + e.name + ' ' + e.message);
                            }
                        });
                };

                self.openLocalStorageDialog = function () {
                    require(['javascripts/source/dialogs/OpenLocalStorage'],
                        function (OpenLocalStorage) {
                            try {
                                var view = new OpenLocalStorage();
                                view.create();
                            }
                            catch (e) {
                                alert('index.html: OpenLocalStorage create ' + e.name + ' ' + e.message);
                            }
                        });
                };

                self.openCSVFileUploadDialog = function () {
                    require(['javascripts/source/dialogs/CSVFileUploadDialog'],
                        function (CSVFileUploadDialog) {
                            try {
                                var view = new CSVFileUploadDialog();
                                view.create();
                            }
                            catch (e) {
                                alert('index.html: CSVFileUploadDialog create ' + e.name + ' ' + e.message);
                            }
                        });
                };

                self.openJSONFileUploadDialog = function () {
                    require(['javascripts/source/dialogs/JSONFileUploadDialog'],
                        function (JSONFileUploadDialog) {
                            try {
                                var view = new JSONFileUploadDialog();
                                view.create();
                            }
                            catch (e) {
                                alert('index.html: JSONFileUploadDialog create ' + e.name + ' ' + e.message);
                            }
                        });
                };

                self.openXMLFileUploadDialog = function () {
                    require(['javascripts/source/dialogs/XMLFileUploadDialog'],
                        function (XMLFileUploadDialog) {
                            try {
                                var view = new XMLFileUploadDialog();
                                view.create();
                            }
                            catch (e) {
                                alert('index.html: XMLFileUploadDialog create ' + e.name + ' ' + e.message);
                            }
                        });
                };

                self.saveLocalStorageDialog = function () {
                    require(['javascripts/source/dialogs/SaveLocalStorage'],
                        function (SaveLocalStorage) {
                            try {
                                var view = new SaveLocalStorage();
                                view.create();
                            }
                            catch (e) {
                                alert('index.html: SaveLocalStorage create ' + e.name + ' ' + e.message);
                            }
                        });
                };

                self.populateGrid = function (data) {
                    require(['javascripts/source/app/GridManager'],
                        function (GridManager) {
                            try {
                                GridManager.populateGrid(data);
                            }
                            catch (e) {
                                alert('index.html: Populate Grid create ' + e.name + ' ' + e.message);
                                console.dir(e);
                            }
                        });
                };

                // now create the app                
                self.create();
            }
            catch (e) {
                alert('App.js ' + e.name + ' ' + e.message + ' ' + e.stack);
            }

        };
    });
