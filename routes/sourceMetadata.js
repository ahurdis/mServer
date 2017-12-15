var express = require('express');
var router = express.Router();
var url = require("url");
var queryString = require("querystring");
var _ = require('underscore');

var MongoHelper = require('../lib/utility/MongoHelper');

var parseJSONObject = function (req) {
  // parses the request url
  var theUrl = url.parse(req.url);

  // gets the query part of the URL and parses it creating an object
  var queryObj = queryString.parse(theUrl.query);

  // and jsonData will be a property of it
  return JSON.parse(queryObj.jsonData);
};

/*
var filterResultSet = function (resultSet, whiteList) {
  var rsRet = [];
  for (var i = 0, l = resultSet.length; i < l; i++) {
    rsRet.push(_.pick(resultSet[i], whiteList));
  }
  return rsRet;
};
*/

/* GET the file information for a particular user. */
router.get('/fileSchema', function (req, res, next) {

  var requestObj = parseJSONObject(req);

  MongoHelper.find('FileSchema',
    { userName: requestObj.userName },
    function (result) {
      if (result) {

        var strResult = JSON.stringify(result);

        res.end('fileSchemaCallback(' + strResult + ')');
      } else {
        res.end('fileSchemaCallback(' + 'No result' + ')');
      }
    });
});

/* GET the sourceName and header information for a source name. */
router.get('/fileSchemaByName', function (req, res, next) {

  var requestObj = parseJSONObject(req);

  MongoHelper.find('FileSchema',
    { sourceName: requestObj.sourceName },
    function (result) {
      if (result) {

        var strResult = JSON.stringify(result);

        res.end('fileSchemaByNameCallback(' + strResult + ')');
      } else {
        res.end('fileSchemaByNameCallback(' + 'No result' + ')');
      }
    });
});

/* GET the sourceName and header information for a particular user. */
router.get('/databaseSchema', function (req, res, next) {

  var requestObj = parseJSONObject(req);

  MongoHelper.find('DatabaseSchema',
    { userName: requestObj.userName },
    function (result) {
      if (result) {

        var strResult = JSON.stringify(result);

        res.end('databaseSchemaCallback(' + strResult + ')');
      } else {
        res.end('databaseSchemaCallback(' + 'No result' + ')');
      }
    });
});

module.exports = router;
