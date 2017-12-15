/**
 * GraphData.js
 * @author Andrew
 */

'use strict';

var Contracts = require('../model/Contracts.js');
var Serialization = require('../utility/Serialization.js');

function GraphData(options, contract) {
    var self = this;
    var state = options;

    // Verify we've fulfilled the contract as passed in by GraphData instances
    if (typeof (contract) !== 'undefined') {
        contract.call(self, state);
    }
    else {
        // first verify that we have a type
    //    Contracts.ContractBase(state);

        // then verify contracts for that type
    //    Contracts[state.type](state);
    }

    self.getState = function () {
        return state;
    };

    /*
    // Now (re)populate non-required fields that we should have
    if (typeof(options) !== 'undefined')
    {
        state.description = options.description || 'default description';
    }
    */

    // Set up the ES5-style getters and setters
    Object.keys(state).forEach(function (prop) {
        Object.defineProperty(self, prop, {
            // Create a new getter for the property
            get: function () {
                return state[prop];
            },
            // Create a new setter for the property
            set: function (val) {
                state[prop] = val;
            },
            enumerable: true
        })
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
        return Serialization.structToJSON('GraphData', state);
    };
};

GraphData.fromJSON = function (value) {
    return Serialization.fromJSON(GraphData, value);
};

module.exports = GraphData;