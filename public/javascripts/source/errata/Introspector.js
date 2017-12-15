// JavaScript source code

/**
 * Introspector.js
 * @author Andrew
 */

'use strict';

define(function () {
    try {
        return function Introspector() {
            var self = this;

        /**
        *    Checks if a property of a specified object has the given type.
        *
        *    @param obj the object to check.
        *    @param name the property name.
        *    @param type the property type (optional, default is 'function').
        *    @returns true if the property exists and has the specified type,
        *    otherwise false.
        */

            var Exists = function (obj, name, type) {
                type = type || 'function';
                return (obj ? self.typeOf(obj[name]) : 'null') === type;
            };

            /**
             Checks the type of a given object.

             @param obj the object to check.
             @returns one of; 'boolean', 'number', 'string', 'object',
              'function', or 'null'.
            */

            self.TypeOf = function (obj) {
                var type = typeof obj;
                return type === 'object' && !obj ? 'null' : type;
            };

            /**
             Introspects an object.

             @param name the object name.
             @param obj the object to introspect.
             @param indent the indentation (optional, defaults to '').
             @param levels the introspection nesting level (defaults to 1).
             @returns a plain text analysis of the object.
            */

            self.Introspect = function (name, obj, indent, levels) {
                indent = indent || '';
                if (self.TypeOf(levels) !== 'number') levels = 1;
                var objType = self.TypeOf(obj);
                var result = [indent, name, ' ', objType, ' :'].join('');
                if (objType === 'object') {
                    if (levels > 0) {
                        indent = [indent, '  '].join('');
                        for (prop in obj) {
                            var prop = self.Introspect(prop, obj[prop], indent, levels - 1);
                            result = [result, '</br>', prop].join('');
                        }
                        return result;
                    }
                    else {
                        return [result, ' ...'].join('');
                    }
                }
                else if (objType === 'null') {
                    return [result, ' null'].join('');
                }
                return [result, ' ', obj].join('');
            };
        }
    }
    catch (e) {
        alert(e.message);
    }
});
