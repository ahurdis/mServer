
// JavaScript source code

/**
 * GridManager.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        var GridManager = function GridManager()
        { };

        GridManager.populateGrid = function (data) {

            var rowData = JSON.parse(data);

            if (rowData) {


                // if one row is returned, it is an object not an array
                if (Array.isArray(rowData) === false) {
                    rowData = [rowData];
                }

                if (rowData.length > 0) {

                    // grab the first object to set up the grid header

                    var obj = rowData[0];

                    var theKeys = Object.keys(obj);

                    theKeys.sort();

                    var fields = [];

                    theKeys.forEach(function (key) {

                        var fieldType = typeof (obj[key]) === 'string' ? 'text' : 'number';

                        var field = {
                            name: key,
                            type: fieldType,
                            width: 100
                        };

                        fields.push(field);
                    });

                    $('#jsGrid').jsGrid('destroy');

                    $('#jsGrid').jsGrid({
                        width: '100%',
                        height: '100%',

                        inserting: false,
                        editing: false,
                        sorting: true,
                        paging: true,

                        loadIndication: true,
                        loadIndicationDelay: 500,
                        loadMessage: 'Please, wait...',
                        loadShading: true,
                        noDataContent: 'Not found',
                        updateOnResize: true,
                        fields: fields
                    });

                    for (var i = 0; i < rowData.length; i++) {
                        $('#jsGrid').jsGrid('insertItem', rowData[i]);
                    }

                    $('#jsGrid').jsGrid('refresh');
                }
            }
        };

        return GridManager;
    }
    catch (e) {
        alert('GridManager ctor: ' + e.message);
    }
});