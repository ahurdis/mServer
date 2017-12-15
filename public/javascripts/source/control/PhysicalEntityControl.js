// JavaScript source code

/**
 * PhysicalEntityControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function PhysicalEntityControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options); 

                // save the Entity Control render function
                var _parentRender = self.render;

                var _edgeHitPos = null;

                self.render = function (ctx, mouseDownPos) {

                    _parentRender(ctx, mouseDownPos);

           //         ctx.save();




          //          ctx.restore();
                };


                // self.create();

                // setup the inheritance chain
                PhysicalEntityControl.prototype = EntityControl.prototype;
                PhysicalEntityControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('PhysicalEntityControl ctor' + e.message);
        }
    });


