'use strict';

var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');
var _ = require('underscore');

function CSVReader(options) {

  var self = this;
  var vertex = options.vertex;

  var lineNumber = 0;
  var lines = [];
  var hasHeader = vertex.hasHeader;
  var fileName = vertex.path;
  var delimiter = vertex.delimiter;

  var header = vertex.attributes.replace(/\s+/g, '');
  var headerArray = [];
  var lineArray = [];

  self.getLines = function () { return lines; };

  self.read = function () {

    return new Promise(function (resolve, reject) {

      var s = fs.createReadStream(fileName)
        .pipe(es.split())
        .pipe(es.mapSync(function (line) {

          // pause the readstream
          s.pause();

          // process line here and call s.resume() when rdy

          // if we are on the first line and the file hasHeader, use header values as the keys
          // note, use == since hasHeader is a string ('true' | 'false')
          if (lineNumber === 0) {

            if (hasHeader) {
              headerArray = header.split(delimiter);
            }
            else {
              // else if we don't have a header, create some based on the number of columns in the file
              var countArray = line.split(delimiter);
              for (var i = 0; i < countArray.length; i++){
                headerArray[i] = 'col_' + i;
              }
            }
          } else {
            // split the line, trim white space, and stick in in line array
            lineArray = line.split(delimiter).map(function(s) { return s.trim() });

            // now create an object with the line array mapped to the header array
            lines.push(_.object(headerArray, lineArray));
          }

          lineNumber += 1;

          // resume the readstream, possibly from a callback
          s.resume();
        })
          .on('error', function (error) {
            console.log('Error while reading file.' + error);
            reject(error);
          })
          .on('end', function () {
            // console.log('Read entire file.')
            // console.log(self.lines);
            resolve(lines);
          })
        );
    });
  };
};

module.exports = CSVReader;