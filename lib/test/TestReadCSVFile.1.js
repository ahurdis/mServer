/*
let CSVReader = require('../utility/CSVParser');
let reader = new CSVReader('filedata/data.csv');
reader.read(() => reader.continue());
*/

var fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');

var lineNr = 0;

var s = fs.createReadStream('filedata/data.csv')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {

        // pause the readstream
        s.pause();

        lineNr += 1;

        // process line here and call s.resume() when rdy
        // function below was for logging memory usage
        // logMemoryUsage(lineNr);

        console.log(line);
            s.destroy();


        // resume the readstream, possibly from a callback
        s.resume();
    })
        .on('data', function (line) {
            console.log(line);
            s.destroy();
        })
        .on('error', function () {
            console.log('Error while reading file.');
        })
        .on('end', function () {
            console.log('Read entire file.')
        })
    );