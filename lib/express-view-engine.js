// compstache view engine for Express

var fs = require('fs');
var FileTree = require('web-template-file-tree');
var Compstache = require('./compstache');

var fileTree;

function compstacheEngine(filePath, options, callback) {

	var views = options.settings.views;
	var viewEngine = options.settings['view engine'];
	if (!fileTree) {
		fileTree = new FileTree(views, {
			extension: viewEngine
		});
	}

	fileTree.load(function (err) {
		if (err) {
			return callback(new Error(err));
		}

		fs.readFile(filePath, {encoding: 'utf8'}, function (err, template) {

			if (err) {
				return callback(new Error(err));
			}

			var output;
			try {
				var render = Compstache(fileTree.cache);
				output = render.fromString(template, options);
			}
			catch (e) {
				return callback(e);
			}

			return callback(null, output);

		});

	});

}

module.exports = compstacheEngine;