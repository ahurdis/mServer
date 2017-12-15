var mysql = require('promise-mysql');
var sqlCity = 'SELECT * FROM world.city WHERE Name = "Amsterdam"';
var sqlCountry = 'SELECT Name FROM world.country WHERE Code = ';

var connection;

mysql.createConnection({
    host: 'localhost',
    user: 'Andrew',
    password: '0p3nup!',
    database: 'world'
})
    .then(function (conn) {
    connection = conn;
}).then(function () {
    return connection.query(sqlCity)
}).then(function (rows) {
    // Query the items for a ring that Frodo owns. 
    return connection.query(sqlCountry + '"' + rows[0].CountryCode + '"');
}).then(function (rows) {
    // Logs out a ring that Frodo owns 
    console.log(rows[0].Name);
});
