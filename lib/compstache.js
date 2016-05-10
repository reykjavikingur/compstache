var _ = require('underscore');
var Mustache = require('mustache');

function Compstache(cache) {

	var transclusions = createTransclusions(cache);

	var slotGroups = [];
	var special = {
		_: function() {
			return function(text, render) {
				slotGroups[0].push(render(text));
			}
		}
	};

	function renderString(template, data) {
		if (!data) {
			data = {};
		}
		data = _.defaults(special, transclusions, data);
		return Mustache.render(template, data, cache);
	}

	function renderKey(key, data) {
		return renderString(cache[key], data);
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

				slotGroups.unshift([]);
				var singleton = render(text);
				var slots = slotGroups.shift();
				if (slots.length === 0) {
					slots.push(singleton);
				}

				var data = _.defaults({
					'$': function() {
						return slots.shift();
					}
				}, context);

				return Mustache.render(template, data, cache);

			};

		};

	}

	renderKey.fromString = renderString;

	return renderKey;

}

module.exports = Compstache;