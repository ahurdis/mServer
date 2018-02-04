// JavaScript source code

/**
 * UDFOutControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function UDFOutControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options); 

                // save the Entity Control render function
                var _parentRender = self.render;

                var _edgeHitPos = null;

                require(['javascripts/source/graph/GraphFactory'],
                    function (GraphFactory) {
                        self.graph = GraphFactory.createSimpleIntegrateGraph();
                    });

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

                    if (self.mouseOverControl(x, y)) {
                        app.addNewUserDocument(self.graph, 'Workflow');
                        return self.focus();
                    }
                };

                // setup the inheritance chain
                UDFOutControl.prototype = EntityControl.prototype;
                UDFOutControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('UDFOutControl ctor' + e.message);
        }
    });


