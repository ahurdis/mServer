// JavaScript source code

/**
 * FunctionControl.js
 * @author Andrew
 */
define(['javascripts/source/control/EntityControl'],
    function (EntityControl) {
        'use strict';
        try {
            return function FunctionControl(options) {

                var self = this;
                // call parent constructor
                EntityControl.call(self, options);

                var _parentRender = self.render;

                var _edgeHitPos = null;

                var getFunctionArguments = function (func) {
                    return (func + '')
                        .replace(/[/][/].*$/mg, '') // strip single-line comments
                        .replace(/\s+/g, '') // strip white space
                        .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
                        .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
                        .replace(/=[^,]+/g, '') // strip any ES6 defaults  
                        .split(',').filter(Boolean); // split & filter [""]
                };

                self.render = function (ctx, mouseDownPos) {
                    _parentRender(ctx, mouseDownPos);
                };

                self.create = function () {

                    if (typeof (self._vertex.func) === 'undefined') {
                        self._vertex.func = app.lib[self._vertex.instance].gd.func;
                    }

                    self._values = getFunctionArguments(self._vertex.func);

                    self.setControlSize();
                };

                self.create();

                // setup the inheritance chain
                FunctionControl.prototype = EntityControl.prototype;
                FunctionControl.prototype.constructor = EntityControl;
            };
        }
        catch (e) {
            alert('FunctionControl ctor' + e.message);
        }
    });


