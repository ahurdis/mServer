var mysql = require("mysql");

var strDb = 'world';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'Andrew',
    password: '0p3nup!',
    database: strDb
});

connection.connect();

/*
connection.query('SHOW DATABASES();', function (err, rows, fields) {
    if (err) throw err;
    
    rows.forEach(function(row) {
        console.log(row.Database);
    });
});
*/

var tables = [];

connection.query('SHOW TABLES;', function (err, rows, fields) {
    if (err) throw err;

    rows.forEach(function (row) {
        var strTable = row['Tables_in_' + strDb];
        tables.push(strTable);
    });
});

connection.query('DESCRIBE city;', function (err, rows, fields) {
    rows.forEach(function (row) {
        console.log('------------');
        console.log('Field: ' + row.Field);
        console.log('Type: ' + row.Type);
        console.log('Null: ' + row.Null);
        console.log('Key: ' + row.Key);
        console.log('Default: ' + row.Default);
        console.log('Extra: ' + row.Extra);
    });
});

connection.end();