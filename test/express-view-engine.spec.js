var should = require('should');

var expressViewEngine = require('../lib/express-view-engine');

describe('expressViewEngine', function () {

	it('should be a function', function () {
		should(expressViewEngine).be.a.Function();
	});

	describe('rendering views/main.html', function () {

		var filePath, options;

		beforeEach(function () {
			filePath = __dirname + '/views/main.html';
			options = {
				settings: {
					views: __dirname + '/views',
					'view engine': 'html'
				}
			};
		});

		describe('callback', function () {

			var actualErr, actualData;

			beforeEach(function (done) {
				expressViewEngine(filePath, options, function (err, data) {
					actualErr = err;
					actualData = data;
					done();
				});
			});

			it('should not pass error', function () {
				should(actualErr).not.be.ok();
			});

			it('should pass data', function () {
				should(actualData).eql('It is a  day to .');
			});

		});

		describe('callback with custom options', function () {

			var actualErr, actualData;

			beforeEach(function (done) {
				options.condition = 'good';
				options.action = 'die';
				expressViewEngine(filePath, options, function(err, data) {
					actualErr = err;
					actualData = data;
					done();
				});
			});

			it('should not pass error', function () {
				should(actualErr).not.be.ok();
			});

			it('should pass data', function () {
				should(actualData).eql('It is a good day to die.');
			});

		});

	});

});