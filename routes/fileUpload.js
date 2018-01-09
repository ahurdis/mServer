var express = require('express');
var multer = require('multer');
var mkdirp = require('mkdirp');

var fs = require('fs');
var util = require('util');
var stream = require('stream');
var es = require('event-stream');

var MongoHelper = require('../lib/utility/MongoHelper');

var lineNr = 0;

var router = express.Router();

var fileName;
var dest = 'filedata/uploads/';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //var code = JSON.parse(req.body.model).empCode;
    mkdirp(dest, function (err) {
      if (err) cb(err, dest);
      else cb(null, dest);
    });
  },
  filename: function (req, file, cb) {
    cb(null, fileName = Date.now() + '-' + file.originalname);
  }
});

var upload = multer({ storage: storage });

/* GET users listing. */
router.post('/csv', upload.any(), function (req, res) {
  try {

    var options = {
      userName: req.body.userName,
      sourceName: req.body.sourceName,
      type: 'csv',
      path: req.files[0].path,
      delimiter: req.body.delimiter,
      hasHeader: req.body.hasHeader,
      attributes: req.body.attributes
    };

    MongoHelper.insertOne('FileSchema', options);

    res.end('fileDialogCallback(' + JSON.stringify(options) + ')');
  } catch (e) {
    console.log(e);
  }

});

router.post('/json', upload.any(), function (req, res) {
  try {

    var options = {
      userName: req.body.userName,
      sourceName: req.body.sourceName,
      type: 'json',
      path: req.files[0].path,
      attributes: req.body.attributes
    };

    MongoHelper.insertOne('FileSchema', options);

    res.end('fileDialogCallback(' + JSON.stringify(options) + ')');
  } catch (e) {
    console.log(e);
  }

});

module.exports = router;
