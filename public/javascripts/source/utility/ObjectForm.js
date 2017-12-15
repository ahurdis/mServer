/**
 * @author Andrew
 */



define([],
    function () {
        'use strict';
        try {
            return function ObjectForm(options) {
                var self = this;
                
                var vertex = options.vertex || {};
                var obj = vertex.getState() || {};
                var typeInfo = options.typeInfo || {};
                var table = options.table;
                var onClose = options.onClose || function () { };
                
                window.of = self;

                self.create = function () {

                    if (obj) {
                        // loop over the proper
                        for (var property in obj) {

                            if (typeInfo[property]) {
                                var propertyType = typeInfo[property].type || 'text';
                                this.insertRow(property, propertyType);
                            }
                            else {
                                this.insertRow(property, 'text');
                            }
                        }
                        // now we can delete the first 'template' row
                        table.deleteRow(0);

                        $('#ObjectFormDIV').dialog({
                            // autoOpen: false,
                            width: 500,
                            height: 'auto',
                            modal: false,
                            buttons: [
                                {
                                    text: "Ok",
                                    icons: {
                                        primary: "ui-icon-heart"
                                    },
                                    click: function () {

                                        // find the values that are different in the in object as passed in and the output 
                                       
                                        var outputObject = self.getOutputObject();
                                        
                                        // first find the values that are in the input that are not in the output 
                                        // and need to be deleted from the object
                                        var deletedProperties = _.difference(Object.keys(obj), Object.keys(outputObject));

                                        _.each(deletedProperties, function (key) { 
                                                                        vertex.deleteProperty(key); 
                                                                  });
                                                                                                            
                                        // then get the objects that need to be added to the object
                                        var insertedProperties = _.difference(Object.keys(outputObject), Object.keys(obj));
                                        
                                        _.each(insertedProperties, function (key) { 
                                                                        vertex.insertProperty(key, outputObject[key]); 
                                                                   });
                                        
                                        // remove the rows from the table
                                        destroy();
                                        
                                        // call the user defined function
                                        onClose();

                                        $(this).dialog("close");
                                    }
                                }
                            ]
                        });
                    }
                }

                var destroy = function () {

                    var rowCount = table.rows.length;
                    // delete all but the first 'template' row
                    for (var i = 1; i < rowCount; i++) {
                        table.deleteRow(-1);
                    }
                }

                self.insertRow = function (property, type) {
                    // insert at the end of the table
                    var row = table.insertRow(-1);

                    // get the number of cells in the table and reproduce them
                    var colCount = table.rows[0].cells.length;

                    for (var i = 0; i < colCount; i++) {

                        var newcell = row.insertCell(i);

                        newcell.innerHTML = table.rows[0].cells[i].innerHTML;
                    
                        // there are three child controls - the second one is the control 
                        var control = newcell.childNodes[1];
                    
                        // set the value 
                        switch (control.type) {
                            case 'text':
                                control.value = property;
                                break;
                            case 'checkbox':
                                control.checked = false;
                                break;
                            case 'select-one':
                                control.value = type;
                                break;
                            default:
                                control.value = property;
                                break;
                        }
                        
                        // control.focus();
                    }
                }

                self.deleteRow = function () {
                    try {
                        var rowCount = table.rows.length;

                        for (var i = 0; i < rowCount; i++) {

                            var row = table.rows[i];
                            var checkbox = row.cells[0].childNodes[1];

                            if (checkbox !== null && checkbox.checked === true) {

                                if (rowCount <= 1) {
                                    alert('Cannot delete all the rows.');
                                    break;
                                }

                                table.deleteRow(i);
                                rowCount--;
                                i--;
                            }
                        }

                    } catch (e) {
                        alert(e);
                    }
                }

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
                }

                self.getOutputObject = function () {
                    try {

                        var objRet = {};

                        var rowCount = table.rows.length;

                        for (var iRow = 0; iRow < rowCount; iRow++) {

                            var row = table.rows[iRow];

                            // get the name of the property
                            var propertyName = getElementValue(row.cells[1].childNodes[1]);
                            var propertyType = getElementValue(row.cells[2].childNodes[1]);

                            objRet[propertyName] = propertyType;
                        }

                        return objRet;

                    } catch (e) {
                        alert(e);
                    }
                }
            }
        }
        catch (e) {
            alert('ObjectForm.js ' + e.name + " " + e.message);
        }

    });
