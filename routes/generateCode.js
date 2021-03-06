let express = require('express');
let fs = require('fs');
let router = express.Router();

let CodeGenerator = require('../lib/algorithm/CodeGenerator');
let GraphUtilities = require('../lib/utility/GraphUtilities');

let writeFile = (filename, data) => {

  fs.writeFile(`filedata/sparkscripts/${filename}`, data, function (err) {
    if (err) {
      return console.dir(err);
    }
    console.log('')
  });
};

/* generate code from graph */
router.get('/spark', function (req, res, next) {

  let options = GraphUtilities.getCodeGenerationInput(req, res);

  let graph = options.graph;
  let documentName = options.documentName;

  GraphUtilities.inflate(graph);

  let codeGenerator = new CodeGenerator({ graph, documentName });

  let strCode = codeGenerator.generateCode();

  // write the code to a file
  writeFile(`${documentName.replace(' ', '')}.py`, strCode);

  res.end('generateCodeCallback(' + JSON.stringify(strCode) + ')');
});

module.exports = router;
