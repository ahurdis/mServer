// JavaScript source code

/**
 * FileControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function JSONFileControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options); 

                // save the Entity Control render function
                var _parentRender = self.render;

                var _edgeHitPos = null;

                self.render = function (ctx, mouseDownPos) {
                    _parentRender(ctx, mouseDownPos);
                };

                // setup the inheritance chain
                JSONFileControl.prototype = EntityControl.prototype;
                JSONFileControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('JSONFileControl ctor' + e.message);
        }
    });


