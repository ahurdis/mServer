var express = require('express');

var router = express.Router();
var GraphURLParser = require('../lib/utility/GraphURLParser');
var CodeGenerator = require('../lib/algorithm/CodeGenerator');

/* generate code from graph */
router.get('/spark', function (req, res, next) {

  let graph = GraphURLParser.getGraph(req, res);

  let codeGenerator = new CodeGenerator( { graph: graph } );

  let strCode = codeGenerator.generateCode();

  // write this to a file and run it!
  res.end('generateCodeCallback(' + JSON.stringify(strCode) + ')');
});

module.exports = router;
