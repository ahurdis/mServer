/**
 * @author Andrew
 */

define([],
    function () {
        'use strict';
        try {
            return function ObjectProperties(options) {
                var self = this;

                var _vertex = options.vertex || {};
                var _displayKeys = _vertex.displayKeys;
                var _typeInfo = options.typeInfo || {};

                var _table = null;

                self.create = function () {

                    var parent = document.getElementById('EntityControlPaneDIV');

                    // remove all prior controls
                    while (parent.hasChildNodes()) {
                        parent.removeChild(parent.lastChild);
                    }

                    createTable(parent);

                    createButtons(parent);
                };

                var updateControl = function () {

                    _vertex.displayKeys = getOutputArray();

                    _vertex.shape._values = _vertex.displayKeys;

                    _vertex.shape.setControlSize();

                    _vertex.shape._parent.render();
                };

                var createTable = function (parent) {

                    _table = document.createElement('table');
                    _table.style.width = '100px';
                    _table.style.border = '1px solid black';

                    if (_displayKeys) {
                        // loop over the proper
                        for (var i = 0; i < _displayKeys.length; i++) {
                            insertRow(_displayKeys[i]);
                        }
                    } else {
                        insertRow('');
                    }
                    parent.appendChild(_table);
                };

                var createButtons = function (parent) {

                    var control = createButton('Add');
                    control.onclick = function (e) { insertRow(""); };
                    parent.appendChild(control);

                    control = createButton('Delete');
                    control.onclick = function (e) { deleteRow();  updateControl(); };
                    parent.appendChild(control);

                    control = createButton('Update');
                    control.onclick = function (e) { updateControl(); };
                    parent.appendChild(control);
                };

                var createButton = function (value) {
                    var control = document.createElement('input');
                    control.type = 'button';
                    control.name = 'name';
                    control.value = value;
                    control.id = 'id';
                    return control;
                };

                var destroy = function () {

                    var rowCount = _table.rows.length;
                    for (var i = 0; i < rowCount; i++) {
                        _table.deleteRow(-1);
                    }
                };

                var insertRow = function (property) {

                    // insert at the end of the table
                    var tr = _table.insertRow(0);

                    for (var column = 0; column < 3; column++) {

                        var td = tr.insertCell();

                        var control = null;

                        switch (column) {

                            case 0:
                                control = document.createElement('input');
                                control.type = 'checkbox';
                                control.name = 'name';
                                control.value = 'value';
                                control.id = 'id';
                                break;

                            case 1:
                                control = document.createElement('input');
                                control.name = 'name';
                                control.value = property;
                                control.id = 'id';
                                break;
                            case 2:
                                control = document.createElement('select');
                                control.name = 'name';

                                var items = ['text', 'number', 'boolean', 'select', 'date'];
                                var values = ['text', 'number', 'boolean', 'select', 'date'];

                                for (var iOption = 0; iOption < items.length; iOption++) {
                                    var opt = document.createElement('option');
                                    opt.text = items[iOption];
                                    opt.value = values[iOption];
                                    control.options.add(opt);
                                }
                                break;
                        }

                        if (control) {
                            td.appendChild(control);
                        }

                        td.style.border = '1px solid black';
                    }
                };

                var deleteRow = function () {
                    try {
                        var rowCount = _table.rows.length;

                        for (var i = 0; i < rowCount; i++) {

                            var row = _table.rows[i];
                            var checkbox = row.cells[0].childNodes[0];

                            if (checkbox !== null && checkbox.checked === true) {
                                _table.deleteRow(i);
                                rowCount--;
                                i--;
                            }
                        }

                    } catch (e) {
                        alert(e);
                    }
                };

                var getElementValue = function (control) {

                    var controlValue = null;
                    // set the value 
                    switch (control.type) {
                        case 'text':
                            controlValue = control.value;
                            break;
                        case 'checkbox':
                            controlValue = control.checked;
                            break;
                        case 'select-one':
                            controlValue = control.value;
                            break;
                        default:
                            controlValue = control.value;
                            break;
                    }

                    return controlValue;
                };

                var getOutputArray = function () {
                    try {

                        var arRet = [];

                        var rowCount = _table.rows.length;

                        for (var iRow = 0; iRow < rowCount; iRow++) {

                            var row = _table.rows[iRow];

                            // get the name of the property
                            var propertyName = getElementValue(row.cells[1].childNodes[0]);
                            var propertyType = getElementValue(row.cells[2].childNodes[0]);

                            // only return non-empty property names
                            if (propertyName) {
                                arRet.push(propertyName);
                            }
                        }

                        return arRet;

                    } catch (e) {
                        alert(e);
                    }
                };
            }
        }
        catch (e) {
            alert('ObjectProperties.js ' + e.name + " " + e.message);
        }
    });
