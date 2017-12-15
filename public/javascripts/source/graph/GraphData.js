// JavaScript source code

/**
 * GraphData.js
 * @author Andrew
 */



define(['javascripts/source/model/Contracts',
    'javascripts/source/graph/GraphSerialization'],
    function (Contracts, GraphSerialization) {

        'use strict';

        function GraphData(options, contract) {

            var self = this;
            var state = options;

            // Verify we've fulfilled the contract as passed in by GraphData instances
            if (typeof (contract) !== 'undefined') {
                contract.call(self, state);
            }
            else {
                // first verify that we have a type
                Contracts.ContractBase(state);

                // then verify contracts are satisfied for that type
                if (typeof (app) !== 'undefined' && typeof app.lib[state.type].contracts === 'function') {
                    app.lib[state.type].contracts(state);
                }
            }

            self.getState = function () {

                var ret = {};
                for (var key in self) {
                    var pd = Object.getOwnPropertyDescriptor(self, key);
                    if (pd.get) {
                        // alert(key + ' is a key.');
                        ret[key] = pd.get();
                    }
                }
                return ret;
            };

            self.getDisplayKeys = function (exclusions) {

                var ret = [];
                for (var key in self) {
                    var pd = Object.getOwnPropertyDescriptor(self, key);
                    if (pd.get) {
                        if (exclusions && exclusions.indexOf(key) > -1) {
                            continue;
                        }
                        else {
                            ret[key] = pd.get();
                        }
                    }
                }
                return ret;
            };

            self.deleteProperty = function (key) {
                delete self[key];
            };

            self.insertProperty = function (key, value) {

                state[key] = value;

                Object.defineProperty(self, key, {
                    // Create a new getter for the property
                    get: function () {
                        return state[key];
                    },
                    // Create a new setter for the property
                    set: function (val) {
                        state[key] = val;
                    },
                    configurable: true,
                    enumerable: true
                });
            };

            // Set up the ES5-style getters and setters
            Object.keys(state).forEach(function (key) {
                Object.defineProperty(self, key, {
                    // Create a new getter for the property
                    get: function () {
                        return state[key];
                    },
                    // Create a new setter for the property
                    set: function (val) {
                        state[key] = val;
                    },
                    configurable: true,
                    enumerable: true
                });
            }, self);

            self.Insert = function () {

                var collection = db.collection(state.type);

                // safe mode ( w : 1 } to ensure document persistance on MongoDB
                collection.insert(state, { w: 1 },
                    function (error, result) {
                        if (error || !result) {
                            console.log('Not Saved');
                            console.log(error);
                            console.log(result);
                        }
                        else {
                            //                            console.log('Saved');
                            //                            console.log(error);
                            console.log(result);
                        }
                    });
            };

            self.PrintName = function () {
                console.log(self.name);
            };

            self.toJSON = function () {
                return GraphSerialization.structToJSON('GraphData', state);
            };
        }

        GraphData.fromJSON = function (value) {
            return GraphSerialization.fromJSON(GraphData, value);
        };

        return GraphData;
    });
