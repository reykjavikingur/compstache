var _ = require('underscore');
var Mustache = require('mustache');

function Compstache(cache) {

	var transclusions = createTransclusions(cache);

	function renderKey(key, data) {
		if (!data) {
			data = {};
		}
		data = _.defaults(transclusions, data);
		var template = cache[key];
		return Mustache.render(template, data, cache);
	}

	function createTransclusions(cache) {
		return _.chain(cache)
			.map(function(template, key) {
				return ['>' + key, createTransclusion(template)]
			})
			.object()
			.value();
	}

	function createTransclusion(template) {

		return function() {

			var context = this;

			return function(text, render) {

				var data = _.defaults({
					'$': function() {
						return render(text);
					}
				}, context);

				return Mustache.render(template, data, cache);

			};

		};

	}

	return renderKey;

}

module.exports = Compstache;