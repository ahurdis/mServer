/**
 * GraphURLParser.js
 * @author Andrew
 */

'use strict';

var url = require('url');
var queryString = require('querystring');
var Serialization = require('./Serialization');
var Graph = require('../graph/Graph.js');
var GraphData = require('../graph/GraphData.js');

function GraphURLParser() 
{};

// A list of constructors the smart reviver should know about  
Serialization.Reviver.constructors = { 'GraphData': GraphData, 'Graph': Graph };

GraphURLParser.parseGraph = function (req) {
    // parses the request url
    var theUrl = url.parse(req.url);
  
    // gets the query part of the URL and parses it creating an object
    var queryObj = queryString.parse(theUrl.query);
  
    var o;
  
    try {
      o = JSON.parse(queryObj.jsonData, Serialization.Reviver);
    }
    catch (e) {
      console.log(e);
    }
    // and jsonData will be a property of it
    return o;
  };
  
  GraphURLParser.getGraph = function (req, res) {
  
    return GraphURLParser.parseGraph(req);
  };
  

module.exports = GraphURLParser;
