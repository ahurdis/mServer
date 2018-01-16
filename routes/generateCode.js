var express = require('express');

var router = express.Router();
var GraphUtilities = require('../lib/utility/GraphUtilities');
var CodeGenerator = require('../lib/algorithm/CodeGenerator');

/* generate code from graph */
router.get('/spark', function (req, res, next) {

  let graph = GraphUtilities.getGraph(req, res);

  GraphUtilities.inflate(graph);

  let codeGenerator = new CodeGenerator( { graph } );

  let strCode = codeGenerator.generateCode();

  // write this to a file and run it!
  res.end('generateCodeCallback(' + JSON.stringify(strCode) + ')');
});

module.exports = router;
