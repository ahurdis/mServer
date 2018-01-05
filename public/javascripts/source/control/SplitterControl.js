// JavaScript source code

/**
 * SplitterControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function SplitterControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options); 

                // save the Entity Control render function
                var _parentRender = self.render;

                self.render = function (ctx, mouseDownPos) {
                    _parentRender(ctx, mouseDownPos);
                };

                // setup the inheritance chain
                SplitterControl.prototype = EntityControl.prototype;
                SplitterControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('SplitterControl ctor' + e.message);
        }
    });


