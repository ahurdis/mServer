/**
 * TextFileReader.js
 * @author Andrew
 */

define([], function () {

    'use strict';

    try {

        var TextFileReader = function TextFileReader()
        { };

        TextFileReader.handleFiles = function (files) {
            // Check for the various File API support.
            if (window.FileReader) {
                // FileReader is supported.
                TextFileReader.getAsText(files[0]);
            } else {
                alert('FileReader is not supported in this browser.');
            }
        };

        TextFileReader.getHeader = function (file) {
            // Check for the various File API support.
            if (window.FileReader) {
                // FileReader is supported.
                var reader = new FileReader();
                // Read file into memory as UTF-8      
                reader.readAsText(file);
                // Handle errors load
                reader.onload = function (event) {
                    var csv = event.target.result;
                    app.attributeArray = TextFileReader.processHeader(csv);
                };

                reader.onerror = TextFileReader.errorHandler;
            } else {
                alert('FileReader is not supported in this browser.');
            }
        };

        TextFileReader.getAsText = function (fileToRead) {

            var reader = new FileReader();
            // Read file into memory as UTF-8      
            reader.readAsText(fileToRead);
            // Handle errors load
            reader.onload = TextFileReader.loadHandler;
            reader.onerror = TextFileReader.errorHandler;
        };

        TextFileReader.loadHandler = function (event) {

            var csv = event.target.result;
            TextFileReader.processData(csv);
        };


        TextFileReader.processHeader = function (csv) {

            var allTextLines = csv.split(/\r\n|\n/);
            var lines = [];
            for (var i = 0; i < 1; i++) {
                var data = allTextLines[i].split(',');
                var tarr = [];
                for (var j = 0; j < data.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
            return lines;
        };

        TextFileReader.processData = function (csv) {

            var allTextLines = csv.split(/\r\n|\n/);
            var lines = [];
            for (var i = 0; i < allTextLines.length; i++) {
                var data = allTextLines[i].split(',');
                var tarr = [];
                for (var j = 0; j < data.length; j++) {
                    tarr.push(data[j]);
                }
                lines.push(tarr);
            }
            console.log(lines);
        };

        TextFileReader.errorHandler = function (evt) {

            if (evt.target.error.name == 'NotReadableError') {
                alert('Cannot read file !');
            }
        };

        return TextFileReader;
    }
    catch (e) {
        alert('TextFileReader ctor: ' + e.message);
    }
});