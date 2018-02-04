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

                var _edgeHitPos = null;

                self.render = function (ctx, mouseDownPos) {
                    _parentRender(ctx, mouseDownPos);
                };

                /**
                 * Fired with the double click event
                 * @param  {Event} e    The double click event
                 */
                self.dblclick = function (e) {

                    var mouse = self._parent.mousePos(e),
                        x = mouse.x,
                        y = mouse.y;

                    if (self.graph.count() === 0) {

                        var vertex1 = self.graph.addVertex({
                            type: 'UDFInControl',
                            displayKeys: self._vertex.displayKeys,
                            x: 50,
                            y: 100,
                            inboundType: 'aro',
                            outboundType: 'aro'
                        });

                        var vertex2 = self.graph.addVertex({
                            type: 'UDFOutControl',
                            x: 250,
                            y: 100,
                            inboundType: 'aro',
                            outboundType: 'aro'
                        });
                    }

                    app.addNewUserDocument(self.graph, 'UDF');

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


