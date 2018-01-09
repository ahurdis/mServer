/**
 * JSONFileReader.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        var JSONFileReader = function JSONFileReader()
        { };

        JSONFileReader.handleFiles = function (files) {
            // Check for the various File API support.
            if (window.FileReader) {
                // FileReader is supported.
                JSONFileReader.getAsText(files[0]);
            } else {
                alert('FileReader is not supported in this browser.');
            }
        };

        JSONFileReader.getAsText = function (fileToRead) {

            var reader = new FileReader();
            // Read file into memory as UTF-8      
            reader.readAsText(fileToRead);
            // Handle errors load
            reader.onload = JSONFileReader.loadHandler;
            reader.onerror = JSONFileReader.errorHandler;
        };

        JSONFileReader.loadHandler = function (event) {
            var json = event.target.result;
            JSONFileReader.processData(json);
        };

        JSONFileReader.processData = function (json) {
            var obj = JSON.parse(json);

            // TODO: we assume that we are getting an array of objects
            app.attributeArray = Object.keys(obj[0]);
        };

        JSONFileReader.errorHandler = function (evt) {

            if (evt.target.error.name == 'NotReadableError') {
                alert('Cannot read file !');
            }
        };

        return JSONFileReader;
    }
    catch (e) {
        alert('JSONFileReader ctor: ' + e.message);
    }
});