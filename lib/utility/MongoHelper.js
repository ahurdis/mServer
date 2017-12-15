/*
 * MongoHelper.js
 * @author Andrew
 */
"use strict";

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/mdb";

function MongoHelper() {};

MongoHelper.insertOne = function (type, data) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(type).insertOne(data, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });
};

MongoHelper.createDatabase = function () {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
};

MongoHelper.createTable = function (tableName) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.createCollection(tableName, function (err, res) {
            if (err) throw err;
            console.log("Table created!");
            db.close();
        });
    });
};

MongoHelper.remove = function (type, where, callback) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(type).deleteOne(where, { $set: set }), function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            if (typeof (callback) !== 'undefined') {
                callback(result);
            }
        }
    });
};

MongoHelper.upsertOne = function (type, where, set, callback) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(type).updateOne(where, { $set: set }), function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            if (typeof (callback) !== 'undefined') {
                callback(result);
            }
        }
    });
};

MongoHelper.find = function (type, where, callback) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection(type).find(where).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
            if (typeof (callback) !== 'undefined') {
                callback(result);
            }
        });
    });
};

/*
    var testInsert = function () {
        insertOne('FileSchema', { name: 'foo', path: '/uploads/files/text.txt', header: ['A', 'B', 'C'] });
    };
 
    var testFind = function () {
        find('FileSchema',
            { name: 'foo' },
            function (result) { console.log(result[0].header) });
    };
 
    try {
        testFind();
        // upsert('FileSchema', { name: 'foo' }, { path: '/' });
 
    }
    catch (e) {
        console.log(e);
    }
*/


module.exports = MongoHelper;