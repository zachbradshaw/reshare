var express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Specify src as the place where public files are found
app.use(express.static(__dirname + '/src'));

module.exports = app;
