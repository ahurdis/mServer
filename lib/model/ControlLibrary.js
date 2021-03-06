﻿
var Contracts = require('../model/Contracts.js');
let _ = require('underscore');

var ControlLibrary = function () { };

ControlLibrary.FormControl = {
    contracts: Contracts.FormControl,
    gd: {
        type: 'FormControl',
        instance: 'EditBox',
        inboundType: 'void',
        outboundType: 'o'
    }
};

ControlLibrary.EditBox = {
    contracts: Contracts.FormControl,
    gd: {
        type: 'FormControl',
        instance: 'EditBox',
        inboundType: 'void',
        outboundType: 'o'
    }
};

ControlLibrary.UDFControl = {
    contracts: Contracts.UDFControl
};

ControlLibrary.UDFInControl = {
    contracts: Contracts.UDFInControl,
    gd: {
        type: 'UDFInControl',
//        instance: 'UDFInControl',
        func: function (aro) {
            return aro;
        },
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.UDFOutControl = {
    contracts: Contracts.UDFOutControl,
    gd: {
        type: 'UDFInControl',
//        instance: 'UDFOutControl',
        func: function (aro) {
            return aro;
        },
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.FunctionControl = {
    contracts: Contracts.FunctionControl
};

ControlLibrary.OutputControl = {
    contracts: Contracts.OutputControl
};

let distinct = function (aro, key) {
    let ret = [];
    for (let out of _.uniq(_.pluck(aro, key))) {
        let t = {};
        t[key] = out;
        ret.push(t);
    }
    return ret;
};

ControlLibrary.Distinct = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Distinct',
        func: distinct,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.FindIndex = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'FindIndex',
        func: _.findIndex,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.First = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'First',
        func: _.first,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.Last = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Last',
        func: _.last,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.Pluck = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Pluck',
        func: _.pluck,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.UniqueId = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'UniqueId',
        func: _.uniqueId,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.Unique = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Unique',
        func: _.uniq,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.Values = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Values',
        func: _.values,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.Sample = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Sample',
        func: _.sample,
        inboundType: 'aro',
        outboundType: 'aro'
    }
};


ControlLibrary.Merge = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'Merge',
        func: function (aro, aro2) {
            let ret = [];

            for (let i = 0; i < aro.length; i++) {
                ret.push(Object.assign(aro[i], aro2[i]));
            }
            return ret;
        },
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.ToLower = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'ToLower',
        func: function (aro) {
            return aro.map((x) => {
                let obj = {};
                for (var i=0; i < Object.keys(x).length; i++){
                    if (Object.values(x)[i] && typeof Object.values(x)[i] !== 'object') {
                        obj[Object.keys(x)[i]] = Object.values(x)[i].toLowerCase();
                    }
                }
                return obj;
            })
        },
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.ToUpper = {
    contracts: Contracts.FunctionControl,
    gd: {
        type: 'FunctionControl',
        instance: 'ToUpper',
        func: function (aro) {
            return aro.map((x) => {
                let obj = {};
                for (var i=0; i < Object.keys(x).length; i++){
                    if (Object.values(x)[i] && typeof Object.values(x)[i] !== 'object') {
                        obj[Object.keys(x)[i]] = Object.values(x)[i].toUpperCase();
                    }
                }
                return obj;
            })
        },
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.LogicalEntityControl = {
    contracts: Contracts.LogicalEntityControl,
    gd: {
        type: 'LogicalEntityControl',
        instance: 'New'
    }
};

ControlLibrary.PhysicalEntityControl = {
    contracts: Contracts.PhysicalEntityControl,
    gd: {
        type: 'PhysicalEntityControl',
        instance: 'New',
        inboundType: 'void',
        outboundType: 'aro'
    }
};

ControlLibrary.SplitterControl = {
    contracts: Contracts.SplitterControl,
    gd: {
        type: 'SplitterControl',
        instance: 'New',
        func: (aro) => {
            return aro;
        },
        inboundType: 'aro',
        outboundType: 'aro'
    }
};

ControlLibrary.CSVFileControl = {
    contracts: Contracts.CSVFileControl,
    gd: {
        type: 'CSVFileControl',
        sourceName: '',
        instance: 'New',
        inboundType: 'void',
        outboundType: 'aro'
    }
};

ControlLibrary.JSONFileControl = {
    contracts: Contracts.JSONFileControl,
    gd: {
        type: 'JSONFileControl',
        sourceName: '',
        instance: 'New',
        inboundType: 'void',
        outboundType: 'aro'
    }
};

ControlLibrary.XMLFileControl = {
    contracts: Contracts.XMLFileControl,
    gd: {
        type: 'XMLFileControl',
        sourceName: '',
        instance: 'New',
        inboundType: 'void',
        outboundType: 'aro'
    }
};

ControlLibrary.Grid = {
    contracts: Contracts.OutputControl,
    gd: {
        type: 'OutputControl',
        instance: 'Grid',
        imageName: 'images/Grid.png',
        inboundType: 'aro',
        outboundType: 'void'
    }
};

ControlLibrary.CSVFile = {
    contracts: Contracts.OutputControl,
    gd: {
        type: 'OutputControl',
        instance: 'CSVFile',
        imageName: 'images/CSVFile.png',
        inboundType: 'aro',
        outboundType: 'void'
    }
};

ControlLibrary.JSONFile = {
    contracts: Contracts.OutputControl,
    gd: {
        type: 'OutputControl',
        instance: 'JSONFile',
        imageName: 'images/JSONFile.png',
        inboundType: 'aro',
        outboundType: 'void'
    }
};

ControlLibrary.DataFlow = {
    contracts: Contracts.DataFlow,
    gd: {
        type: 'DataFlow',
        instance: 'Connector'
    }
};

ControlLibrary.Association = {
    contracts: Contracts.Association,
    gd: {
        type: 'Association',
        instance: 'Connector'
    }
};

module.exports = ControlLibrary;