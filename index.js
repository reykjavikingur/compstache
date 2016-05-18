var Compstache = require('./lib/compstache');
var expressViewEngine = require('./lib/express-view-engine');

Compstache.__express = expressViewEngine;

module.exports = Compstache;