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

  let graph = GraphUtilities.getGraph(req, res);

  GraphUtilities.inflate(graph);

  let codeGenerator = new CodeGenerator({ graph });

  let strCode = codeGenerator.generateCode();

  // write this to a file
  writeFile(`myscript.py`, strCode);

  res.end('generateCodeCallback(' + JSON.stringify(strCode) + ')');
});

module.exports = router;
