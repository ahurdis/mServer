
let CSVReader = require('../utility/CSVReader');
let reader = new CSVReader({ fileName: 'filedata/data.csv' });
var myLines = [];
reader.read(function (lines) { 
                console.log('callback called');
                myLines = lines; 
            });
console.log(myLines);