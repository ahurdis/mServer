// JavaScript source code

/**
 * UDFInControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function UDFInControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options);

                var getUDFControl = function () {
                    var doc = app.getActiveDocument();
                    var controls = doc.canvas.getControls();
                    var i = 0;
                };

                var udfControl = options.udfControl || getUDFControl();
                // save the Entity Control render function
                var _parentRender = self.render;

                var _edgeHitPos = null;

                self.render = function (ctx, mouseDownPos) {
                    _parentRender(ctx, mouseDownPos);
                };

                self.updateControl = function () {
                    udfControl.setDisplayKeys(self._values);
                };



                // setup the inheritance chain
                UDFInControl.prototype = EntityControl.prototype;
                UDFInControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('UDFInControl ctor' + e.message);
        }
    });


