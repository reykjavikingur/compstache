# Compstache

Compstache extends [Mustache](https://mustache.github.io/) and adds support for component based architecture.

## Example

```
var Compstache = require('compstache');

var cache = {
	button: '<button>Click here</button>',
	layout: '<html><body>Welcome to {{title}}. {{>button}} <div>{{$}}</div> <hr/> Copyright &copy; 2016 </body></html>',
	home: '{{#>layout}}This site is all about {{topic}}.{{/>layout}}'
};

var render = Compstache(cache);

var output = render('home', {
	title: 'CRAP',
	topic: 'Contrast, Repetition, Alignment, and Proximity'
});

console.log(output); // render the template

```

See the [Mustache documentation](https://github.com/janl/mustache.js) for all the base capabilities.

## Additions

Compstache adds the following to Mustache:

### Components

A component is simply an "include" (in the Mustache sense). You can include anything in `cache`.

For instance, `{{>button}}` renders as the template string in `cache['button']`.

### Layout Components

A layout component is simply a "section" (in the Mustache sense) that matches a component name in `cache` that has one or more slots marked by `{{$}}`.

For instance, if `cache['layout']` is `start {{$}} finish`, then `{{#>layout}}content{{/>layout}}` renders as the template string with the inner content being injected into the slot, that is, "start content finish".

### Multi-slot Layout Components

A layout component can have more than one slot. You can pass the content for multiple slots by wrapping them in `{{#_}}` and `{{/_}}` markers.
