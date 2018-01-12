var express = require('express');
let ControlLibrary = require('../lib/model/ControlLibrary');
var router = express.Router();

/* GET home page. */
router.get('/getControls', function (req, res, next) {

  let controlArray = [];

  for (key of Object.keys(ControlLibrary)) 
  { 

    const strControl = JSON.stringify(ControlLibrary[key], (key, value) => {
      if (typeof value === 'function') {
        return value.toString();
      }
      return value;
    });

    controlArray.push(strControl);
  }

  let strResponse = JSON.stringify(controlArray);

  // here we use single quotes since we're sending JSON object with double quotes
  res.end("controlsCallback('" + strResponse + "')");
});

module.exports = router;
