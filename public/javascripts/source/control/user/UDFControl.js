// JavaScript source code

/**
 * UDFControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl',
    'javascripts/source/graph/Graph',
    'javascripts/source/graph/GraphStorage'],
    function (EntityControl, Graph, GraphStorage) {
        'use strict';
        try {
            return function UDFControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options);

                self.graph = null;
                self.inputControl = null;
                self.outputControl = null;

                self.userDocument = null;

                self.updateControl = function () {
                    inputControl.setDisplayKeys(self._values);
                };

                /**
                 * Fired with the double click event
                 * @param  {Event} e    The double click event
                 */
                self.dblclick = function (e) {

                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    // the document for this control can be new
                    // the document can exist but not be opened
                    // the document can be opened, but the tab isn't active

                    var activeUserDocument = app.getUserDocumentFromName(self._instance);

                    var graphInStorage = GraphStorage.getGraph(self._instance);

                    if (activeUserDocument) {
                        app.tm.setActiveTabByID(activeUserDocument.tabID);
                    } else {

                        if (graphInStorage) {
                            // open the user document
                            var userDocument = app.openUserDocument(self._instance);
                            if (userDocument) {
                                self.graph = userDocument.canvas.graph(); // getGraph();
                            }
                                                    }
                        else {  // !graphInStorage && !activeUserDocument
                            self.graph = new Graph();

                            self.inputControl = self.graph.addVertex({
                                type: 'UDFInControl',
                                instance: 'In',
                                displayKeys: self._vertex.displayKeys,
                                udfControl: self,
                                x: 50,
                                y: 100,
                                inboundType: 'aro',
                                outboundType: 'aro'
                            });

                            self.outputControl = self.graph.addVertex({
                                type: 'UDFOutControl',
                                instance: 'Out',
                                displayKeys: ['aro'],
                                x: 250,
                                y: 100,
                                inboundType: 'aro',
                                outboundType: 'aro'
                            });

                            self.userDocument = app.addNewUserDocument(self.graph, 'UDF', self);
                        }
                    };
                };

                // setup the inheritance chain
                UDFControl.prototype = EntityControl.prototype;
                UDFControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('UDFControl ctor' + e.message);
        }
    });


