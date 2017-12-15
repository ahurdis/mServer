
/**
 * @author Andrew
 */



define(['javascripts/source/graph/Graph',
    'javascripts/source/graph/GraphData'],
    function (Graph, GraphData) {

        'use strict';

        try {

            var GraphSerialization = function GraphSerialization() {
            };



            // A generic "smart reviver" function.
            // Looks for object values with a `ctor` property and
            // a `data` property. If it finds them, and finds a matching
            // constructor that has a `fromJSON` property on it, it hands
            // off to that `fromJSON` function, passing in the value.

            GraphSerialization.Reviver = function (key, value) {
                var ctor;
                if (value !== null && 
                    typeof value === 'object' &&
                    typeof value.ctor === 'string' &&
                    typeof value.data !== 'undefined') {

                    ctor = app.constructors[value.ctor];

                    if (typeof ctor === 'function' &&
                        typeof ctor.fromJSON === 'function') {
                        return ctor.fromJSON(value.data);
                    }
                }
                return value;
            };


            // A generic "toJSON" function that creates the data expected
            // by Reviver.
            // `ctorName`  The name of the constructor to use to revive it
            // `obj`       The object being serialized
            // `keys`      (Optional) Array of the properties to serialize,
            //             if not given then all of the objects "own" properties
            //             that don't have function values will be serialized.
            //             (Note: If you list a property in `keys`, it will be serialized
            //             regardless of whether it's an "own" property.)
            // Returns:    The structure (which will then be turned into a string
            //             as part of the JSON.stringify algorithm)
            GraphSerialization.toJSON = function (ctorName, obj, keys) {

                var data, key;

                if (!keys) {
                    keys = Object.keys(obj); // Only "own" properties are included
                }

                data = {};

                for (var index = 0; index < keys.length; ++index) {
                    key = keys[index];
                    data[key] = obj[key];
                }

                return { ctor: ctorName, data: data };
            };

            // A generic "toJSON" function that creates the data expected
            // by Reviver.
            // `ctorName`  The name of the constructor to use to revive it
            // `obj`       The object being serialized
            // `keys`      (Optional) Array of the properties to serialize,
            //             if not given then all of the objects "own" properties
            //             that don't have function values will be serialized.
            //             (Note: If you list a property in `keys`, it will be serialized
            //             regardless of whether it's an "own" property.)
            // Returns:    The structure (which will then be turned into a string
            //             as part of the JSON.stringify algorithm)
            GraphSerialization.structToJSON = function (ctorName, state) {
                return { ctor: ctorName, data: state };
            };

            // A generic "fromJSON" function for use with Reviver: Just calls the
            // constructor function with no arguments, then applies all of the
            // key/value pairs from the raw data to the instance. Only useful for
            // constructors that can be reasonably called without arguments!
            // `ctor`      The constructor to call
            // `data`      The data to apply
            // Returns:    The object
            GraphSerialization.fromJSON = function (Ctor, data) {

                var obj = new Ctor(data);

                for (var name in data) {
                    obj[name] = data[name];
                }

                return obj;
            };

            return GraphSerialization;

        }
        catch (e) {
            alert('GraphStorage: ctor ' + e.name + ' ' + e.message);
        }
    });


