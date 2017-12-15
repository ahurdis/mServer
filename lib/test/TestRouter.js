var express = require('express');        
var app = express();                 
var bodyParser = require('body-parser');



app.set('views', './views');
app.set('view engine', 'jade');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
// var port = process.env.PORT || 8080;        
var port = 1756;        

// Establish routes for the API
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:1756/api)
router.get('/', function (req, res) {
//    res.json({ message: 'Welcome to the Graph api!' });
    res.render('index', { title: 'Hey', message: 'Hello there!' });
});

// more routes for our API will happen here
router.route('/graph')

    // create a bear (accessed at POST http://localhost:1756/api/graph)
    .post(function (req, res) {
    
    
    
        res.json({ message: 'A graph named ' + req.body.name + ' has been created!' });
    })
    // get all the bears (accessed at GET http://localhost:1756/api/graph)
    .get(function (req, res) {
        res.json({ message: 'Get all of the graphs!' });
    });

app.use('/api', router);

// Start the Server
app.listen(port);
console.log('Server running at  http://127.0.0.1:' + port);