
var Contract = require('../utility/Contract.js');

var Contracts = function () { };

Contracts.ContractBase = function (options) {
    Contract.expectString(options.type, 'GraphData::type');
};

Contracts.PhysicalEntityControl = function (options) {
    Contract.expectString(options.database, 'PhysicalEntityControl.database must be a string.');
};

Contracts.CSVFileControl = function (options) {
    Contract.expectString(options.sourceName, 'CSVFileControl.sourceName must be a string.');
};

Contracts.XMLFileControl = function (options) {
    Contract.expectString(options.sourceName, 'XMLFileControl.sourceName must be a string.');
};

Contracts.JSONFileControl = function (options) {
    Contract.expectString(options.sourceName, 'JSONFileControl.sourceName must be a string.');
};

Contracts.LogicalEntityControl = function (options) {
    Contract.expectString(options.instance, 'LogicalEntityControl.database must be a string.');
};

Contracts.FunctionControl = function (options) {
    Contract.expectFunction(options.func, 'FunctionControl.func must be a function.');
};


Contracts.OutputControl = function (options) {
    Contract.expectString(options.imageName, 'OutputControl.imageName must be a string.');
};

Contracts.FormControl = function (options) {
    
};

Contracts.DataFlow = function (options) {
    Contract.expectString(options.argumentName, 'DataFlow.argumentName must be a string.');
};

Contracts.Association = function (options) {
    // Contract.expectString(options.argumentName, 'Association.argumentName must be a string.');
};

module.exports = Contracts;