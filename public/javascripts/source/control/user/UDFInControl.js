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

                var udfControl = options.udfControl;

                self.updateControl = function () {
                    udfControl.setDisplayKeys(self._values);
                    udfControl._vertex.insertProperty('displayKeys', self._values);
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


