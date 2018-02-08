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

                // setup the inheritance chain
                PhysicalEntityControl.prototype = EntityControl.prototype;
                PhysicalEntityControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('PhysicalEntityControl ctor' + e.message);
        }
    });


