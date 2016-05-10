var should = require('should');

var Compstache = require('..');

describe('Compstache', function() {

	describe('rendering function', function() {

		var render;

		beforeEach(function() {
			render = Compstache({});
		});

		it('should create function', function() {
			should(render).be.a.Function();
		});

		it('should fail', function() {
			should(function() {
				render();
			}).throw();
		});

	});

	describe('given cache with one template without interpolation', function() {

		var cache;

		beforeEach(function() {
			cache = {
				'foo': 'hey'
			};
		});

		describe('rendering function', function() {
			var render;
			beforeEach(function() {
				render = Compstache(cache);
			});

			it('should render from cache', function() {
				should(render('foo')).eql('hey');
			});

		});

	});

	describe('given cache with one template with interpolation', function() {

		var cache;

		beforeEach(function() {
			cache = {
				'foo': 'It is {{condition}} here'
			};
		});

		describe('rendering function', function() {
			var render;
			beforeEach(function() {
				render = Compstache(cache);
			});

			it('should render from cache and interpolate without value', function() {
				should(render('foo')).eql('It is  here');
			});

			it('should render from cache and interpolate with value', function() {
				var data = {
					condition: 'basic'
				};
				should(render('foo', data)).eql('It is basic here');
			});

		});

	});

	describe('given cache with inclusion', function() {

		var cache;

		beforeEach(function() {
			cache = {
				'doc': 'click the {{>btn}}',
				'btn': 'Button'
			};
		});

		describe('rendering function', function() {
			var render;
			beforeEach(function() {
				render = Compstache(cache);
			});

			it('should render and include', function() {
				var output = render('doc');
				should(output).eql('click the Button');
			});
		});

	});

	describe('given cache with inclusion having interpolation', function() {
		var cache, render;
		beforeEach(function() {
			cache = {
				header: 'Title = {{t}}',
				doc: 'J {{>header}} K'
			};
			render = Compstache(cache);
		});
		it('should be able to interpolate in inclusion', function() {
			var output = render('doc', {
				t: 'Page'
			});
			should(output).eql('J Title = Page K');
		});
	});

	describe('given cache with transclusion having zero slots', function() {

		var cache;

		beforeEach(function() {
			cache = {
				'doc': 'S {{#>layout}} xyz {{/>layout}} T',
				'layout': 'M N'
			};
		});

		describe('rendering function', function() {
			var render;
			beforeEach(function() {
				render = Compstache(cache);
			});

			it('should transclude', function() {
				var output = render('doc');
				should(output).eql('S M N T');
			});

		});

	});

	describe('given cache with transclusion having one slot', function() {

		var cache;
		beforeEach(function() {
			cache = {
				'doc': 'S {{#>layout}}xyz{{/>layout}} T',
				'layout': 'M {{$}} N'
			};
		});

		describe('rendering function', function() {
			var render;
			beforeEach(function() {
				render = Compstache(cache);
			});

			it('should render and transclude', function() {
				var output = render('doc');
				should(output).eql('S M xyz N T')
			});

		});

	});

	describe('given cache with one transclusion having one inclusion', function() {

		var cache;
		beforeEach(function() {
			cache = {
				'doc': 'S {{#>layout}}xyz{{/>layout}} T',
				'btn': 'Click',
				'layout': 'M {{>btn}} {{$}} N'
			};
		});

		describe('rendering function', function() {
			var render;
			beforeEach(function() {
				render = Compstache(cache);
			});

			it('should transclude and include', function() {
				var output = render('doc');
				should(output).eql('S M Click xyz N T');
			});

		});

	});

	describe('given cache with one transclusion used in context beside one inclusion', function() {
		var cache, render;
		beforeEach(function() {
			cache = {
				btn: 'Click',
				layout: 'M {{$}} N',
				doc: 'S {{>btn}} {{#>layout}}xyz{{/>layout}} T'
			};
			render = Compstache(cache);
		});
		it('should be able to render, include, and transclude', function() {
			var output = render('doc');
			should(output).eql('S Click M xyz N T');
		});
	});

	describe('given cache with one transclusion having interpolation', function() {
		var cache, render;
		beforeEach(function() {
			cache = {
				layout: 'M P={{p}} {{$}} N',
				doc: 'FP={{p}}, S {{#>layout}}xyz{{/>layout}} T'
			};
			render = Compstache(cache);
		});
		it('should be able to render and pass context', function() {
			var output = render('doc', {
				p: 'Page'
			});
			should(output).eql('FP=Page, S M P=Page xyz N T');
		});
	});

	describe('given cache with multiple layers of transclusions', function() {
		var cache, render;
		beforeEach(function() {
			cache = {
				widget: 'W {{$}} J',
				layout: 'M {{#>widget}}{{$}}{{/>widget}} N',
				doc: 'S {{#>layout}}xyz{{/>layout}} T'
			};
			render = Compstache(cache);
		});
		it('should be able to transclude through multiple layers', function() {
			var output = render('doc');
			should(output).eql('S M W xyz J N T');
		});
	});

	describe('given cache with nesting transclusions', function() {

		var cache, render;
		beforeEach(function() {
			cache = {
				widget: 'W {{$}} J',
				blob: 'B {{#>widget}}nok{{/>widget}} C',
				slob: 'ss {{>blob}} tt',
				layout: 'M {{$}} N',
				doc: 'S {{#>layout}}xyz{{/>layout}} T',
				wayout: 'M {{#>widget}}m {{$}} n{{/>widget}} N',
				smoc: 'S {{#>wayout}}xyz{{/>wayout}} T'
			};
			render = Compstache(cache);
		});

		it('should render one level', function() {
			should(render('blob')).eql('B W nok J C');
		});

		it('should include and transclude', function() {
			should(render('slob')).eql('ss B W nok J C tt');
		});

		it('should transclude one level', function() {
			should(render('doc')).eql('S M xyz N T');
		});

		it('should transclude two levels', function() {
			should(render('smoc')).eql('S M W m xyz n J N T');
		});

	});

	describe('given cache with transclusion used with extension syntax', function() {

		var cache, render;

		beforeEach(function() {
			cache = {
				layout: 'M {{$}} N',
				doc: 'S {{#>layout}}{{#_}}xyz{{/_}}{{/>layout}} T'
			};
			render = Compstache(cache);
		});

		it('should be able to render', function() {
			should(render('doc')).eql('S M xyz N T');
		});
	});

	describe('given cache with transclusion having two slots', function() {

		var cache, render;

		beforeEach(function() {
			cache = {
				layout: 'L {{$}} M {{$}} N',
				doc: 'S {{#>layout}}{{#_}}abc{{/_}} {{#_}}xyz{{/_}}{{/>layout}} T'
			};
			render = Compstache(cache);
		});

		it('should be able to render transclusion with both slots', function() {
			should(render('doc')).eql('S L abc M xyz N T');
		});

	});

	describe('given cache with nested transclusions using extension syntax', function() {
		var cache, render;
		beforeEach(function() {
			cache = {
				widget: 'W {{$}} J',
				layout: 'M {{#>widget}}{{#_}}m {{$}} n{{/_}}{{/>widget}} N',
				doc: 'S {{#>layout}}{{#_}}xyz{{/_}}{{/>layout}} T'
			};
			render = Compstache(cache);
		});

		it('should be able to render multiple layers', function() {
			should(render('doc')).eql('S M W m xyz n J N T');
		});
	});

});