// JavaScript source code

/**
 * UDFControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl',
    'javascripts/source/graph/Graph'],
    function (EntityControl, Graph) {
        'use strict';
        try {
            return function UDFControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options);

                // save the Entity Control render function
                var _parentRender = self.render;

                self.graph = new Graph();
                var inputControl, outputControl;

                var _edgeHitPos = null;

                self.render = function (ctx, mouseDownPos) {
                    _parentRender(ctx, mouseDownPos);
                };

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
                    var userDocument = app.getUserDocumentFromName(self._instance);

                    if (self.graph.count() === 0) {

                        inputControl = self.graph.addVertex({
                            type: 'UDFInControl',
                            displayKeys: self._vertex.displayKeys,
                            udfControl: self,
                            x: 50,
                            y: 100,
                            inboundType: 'aro',
                            outboundType: 'aro'
                        });

                        outputControl = self.graph.addVertex({
                            type: 'UDFOutControl',
                            x: 250,
                            y: 100,
                            inboundType: 'aro',
                            outboundType: 'aro'
                        });

                        app.addNewUserDocument(self.graph, 'UDF');
                    } else if (!userDocument) {
                        // opening the user document
                        app.openUserDocument(self._instance);
                    } else if (userDocument) {
                        app.setActiveTab(userDocument.tabID);
                    }

                    return self.focus();
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


