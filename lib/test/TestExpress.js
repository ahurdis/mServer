// This is Hello World with express 
// Module dependencies. 
var express = require('express');
var url = require("url");
var queryString = require("querystring");

var app = express();

var path = require('path');

var Graph = require('../graph/Graph.js');

var graph = new Graph();

var jsonGraph = JSON.stringify(graph);
//console.log(jsonGraph);

var addVertex = function (req, res) {
     // parses the request url
    var theUrl = url.parse(req.url);
    
    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse(theUrl.query);
    
    // and jsonData will be a property of it
    var obj = JSON.parse(queryObj.jsonData);
    
    var v = graph.addVertex(obj);
    
    console.log(v.type);
    
    console.log('Created Vertex ' + graph.count());
    
    res.end('_testcb(' + graph.count()  + ')');
};

// Routes 
app.get('/', function(req, res) {
    res.sendFile('about.html', { root: path.join(__dirname, '../html') });
}); 

app.get('/addVertex', addVertex);

app.listen(1337);

console.log('Server running at http://127.0.0.1:1337/');
