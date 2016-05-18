var express = require('express');
var Compstache = require('..');
//var compstacheEngine = require('../lib/express-view-engine');

var app = express();

var port = process.env.PORT || 3000;

app.engine('html', Compstache.__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res, next) {
	res.render('index', {});
});

app.listen(port, function(err) {
	if (err) {
		console.error('unable to start server', err);
	}
	else {
		console.log('server started on port ' + port);
	}
});