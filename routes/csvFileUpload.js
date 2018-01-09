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
router.post('/', upload.any(), function (req, res) {
  try {

    var options = {
      userName: req.body.userName,
      sourceName: req.body.sourceName,
      path: req.files[0].path,
      delimiter: req.body.delimiter,
      hasHeader: req.body.hasHeader,
      header: req.body.header
    };

    MongoHelper.insertOne('FileSchema', options);

    res.end('fileDialogCallback(' + JSON.stringify(options) + ')');
  } catch (e) {
    console.log(e);
  }

});

module.exports = router;
