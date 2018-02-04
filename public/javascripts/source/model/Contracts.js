// JavaScript source code

/**
 * Contracts.js
 * @author Andrew
 */

define(['javascripts/source/utility/Contract'], function (Contract) {

    'use strict';
    try {

        var Contracts = function Contracts() { };

        Contracts.ContractBase = function (options) {
            Contract.expectString(options.type, 'GraphData::type');
        };

        Contracts.PhysicalEntityControl = function (options) {
            Contract.expectString(options.database, 'PhysicalEntityControl.database must be a string.');
        };

        Contracts.SplitterControl = function (options) {
        //     Contract.expectString(options.instance, 'LogicalEntityControl.database must be a string.');
        };

        Contracts.LogicalEntityControl = function (options) {
            Contract.expectString(options.instance, 'LogicalEntityControl.database must be a string.');
        };

        Contracts.FunctionControl = function (options) {
           // Contract.expectFunction(options.func, 'FunctionControl.func must be a function.');
        };

        Contracts.OutputControl = function (options) {
           Contract.expectString(options.imageName, 'OutputControl.imageName must be a string.');
        };

        Contracts.UDFControl = function (options) {
        };

        Contracts.FormControl = function (options) {
        };

        Contracts.DataFlow = function (options) {
        //    Contract.expectString(options.argumentName, 'DataFlow.argumentName must be a string.');
        };

        Contracts.Association = function (options) {
            // Contract.expectString(options.argumentName, 'Association.argumentName must be a string.');
        };

        return Contracts;
    }
    catch (e) {
        alert(e.message);
    }
});
