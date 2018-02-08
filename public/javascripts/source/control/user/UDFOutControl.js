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

                // setup the inheritance chain
                UDFOutControl.prototype = EntityControl.prototype;
                UDFOutControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('UDFOutControl ctor' + e.message);
        }
    });


