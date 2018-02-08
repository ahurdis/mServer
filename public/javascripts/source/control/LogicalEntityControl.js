// JavaScript source code

/**
 * LogicalEntityControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function LogicalEntityControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options);

                // get the keys to display, passing in the vertex's keys to exclude
                self._values = Object.keys(self._vertex.getDisplayKeys(['x', 'y', 'instance', 'id', 'type', 'imageName', 'shape', 'displayKeys']));

                // setup the inheritance chain
                LogicalEntityControl.prototype = EntityControl.prototype;
                LogicalEntityControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('LogicalEntityControl ctor' + e.message);
        }
    });


