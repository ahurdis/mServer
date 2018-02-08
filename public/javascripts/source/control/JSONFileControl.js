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

                // setup the inheritance chain
                JSONFileControl.prototype = EntityControl.prototype;
                JSONFileControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('JSONFileControl ctor' + e.message);
        }
    });


