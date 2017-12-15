var express = require('express');
var mysql = require("mysql");
var util = require('util');
var router = express.Router();

var url = require("url");
var queryString = require("querystring");

var MongoHelper = require('../lib/utility/MongoHelper');

var sourceSchemaString = "SELECT table_schema, table_name, column_name, ordinal_position, data_type, " +
    "numeric_precision, column_type, column_default, is_nullable, column_comment " +
    "FROM information_schema.columns WHERE (table_schema='%s') order by table_name, ordinal_position;";

var parseJSONObject = function (req) {
    // parses the request url
    var theUrl = url.parse(req.url);

    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse(theUrl.query);

    // and jsonData will be a property of it
    return JSON.parse(queryObj.jsonData);
};

router.get('/', function (req, res, next) {

    var obj = parseJSONObject(req);

    var host = obj.host;
    var user = obj.user;
    var password = obj.password;
    var database = obj.database;

    if (host && user && password && database) {

        var connection = mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });


        connection.connect(function (err) {
            if (!err) {
                console.log("Database is connected ... nn");

                var tables = [];

                var response = {};

                connection.query('SHOW TABLES;', function (err, rows, fields) {
                    if (err) throw err;

                    rows.forEach(function (row) {
                        var strTable = row['Tables_in_' + database];
                        tables.push(strTable);
                    });

                    response.success = true;
                    response.tables = tables.toString();


                    var strResponse = JSON.stringify(response);

                    // here we use single quotes since we're sending JSON object with double quotes
                    res.end("mySQLCallback('" + strResponse + "')");
                });
            } else {
                console.log('Error connecting database ...' + err.message);

                // here we use double quotes since the error messages might contain single quotes
                res.end("mySQLCallback('" + JSON.stringify(err) + "')");
                //                res.end('_testcb("' + err.code + '")');
            }
        });
    }
});

router.get('/source_schema', function (req, res, next) {

    var obj = parseJSONObject(req);

    var userName = obj.userName;
    var host = obj.host;
    var user = obj.user;
    var password = obj.password;
    var database = obj.database;

    if (host && user && password && database) {

        var connectionInfo = {
            host: host,
            user: user,
            password: password,
            database: database
        };

        var connection = mysql.createConnection(connectionInfo);

        connection.connect(function (err) {
            if (!err) {
                console.log('Database is connected...');

                var tables = [];

                var response = {};

                connection.query(util.format(sourceSchemaString, database), function (err, rows, fields) {
                    if (err) throw err;

                    response.success = true;
                    response.database = database;
                    response.fields = fields;
                    response.rows = rows;

                    var strResponse = JSON.stringify(response); // .replace(/'/g, '~');

                    var obj = {
                        userName: userName,
                        database: database,
                        fields: fields,
                        rows: rows
                    };

                    MongoHelper.insertOne('DatabaseSchema', obj);

                    // add connectionInfo 
                    MongoHelper.insertOne('Credentials', connectionInfo); 
                    // the sourceSchema has both double and single quotes in it, so we change the single quotes before sending it back

                    // here we use single quotes since we're sending JSON object with double quotes
                    res.end('sourceSchemaCallback(' + strResponse + ')');
                });
            } else {
                console.log('Error connecting database ...' + err.message);

                // here we use double quotes since the error messages might contain single quotes
                res.end("sourceSchemaCallback('" + JSON.stringify(err) + "')");
                //                res.end('_testcb("' + err.code + '")');
            }
        });
    }
});

module.exports = router;
