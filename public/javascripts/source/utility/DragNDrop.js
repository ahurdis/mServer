/*
 * DragNDrop.js
 * @author Andrew
 */

'use strict';

function allowDrop(event) {
    event.preventDefault();
};

function drag(event) {
    event.dataTransfer.setData("Text", event.target.id);
    var img = new Image();
    img.src = 'images/AddNode.png';
    img.width = 10;
    event.dataTransfer.setDragImage(img, 0, 0);
};

function drop(event, canvasID) {
    event.preventDefault();

    var instanceName = event.dataTransfer.getData("Text");

    var options = _.clone(app.lib[instanceName].gd);
    // now we get the canvas control from the document list based on the canvasID 
    var doc = app.getUserDocumentFromCanvasID(canvasID);

    doc.canvas.addNewControl(event, options);
};

function handleTreeDragMove(node, event) {

};

function handleTreeDragStop(node, event) {
    console.log(node, event);

    var canvasID = event.target.id;

    var options = null; 

    var sourceSchema = app.sourceSchema[node.name];

    var parentNode = node.parent.name;

    // depending on whether this is a file source or... other for now 
    if (parentNode === 'CSV File') {
        options = _.clone(app.lib.CSVFileControl.gd);
        options.displayKeys = [];

        options.sourceName = sourceSchema.sourceName;
        options.attributes = sourceSchema.attributes;
        options.hasHeader = sourceSchema.hasHeader;
        options.delimiter = sourceSchema.delimiter;
        options.path = sourceSchema.path;
        
        var attributeArray = options.attributes.split(options.delimiter + ' ');
        options.displayKeys.push.apply(options.displayKeys, attributeArray);
    } else if (parentNode === 'JSON File') {
        options = _.clone(app.lib.JSONFileControl.gd);
        options.displayKeys = [];

        options.sourceName = sourceSchema.sourceName;
        options.attributes = sourceSchema.attributes;
        options.path = sourceSchema.path;
        var attributeArray = options.attributes.split(',');
        options.displayKeys.push.apply(options.displayKeys, attributeArray);
    } else {
        options = _.clone(app.lib.PhysicalEntityControl.gd);
        options.displayKeys = [];
        options.database = parentNode;
        
        var rows = app.sourceSchema[parentNode].rows;
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].table_name === node.name) {
                options.displayKeys.push(rows[i].column_name);
            }
        }
    }

    options.instance = node.name;

    // now we get the canvas control from the document list based on the canvasID 
    var doc = app.getUserDocumentFromCanvasID(canvasID);

    doc.canvas.addNewControl(event, options);
};





