(function(global){
	var nocturne = {
		VERSION: '0.0.11',
		lesson: 'Part 11: Touch',
		alias: '$n'
	};

	nocturne.isArray = Array.isArray || function(object){
		return !!(object && object.concat && object.unshift && !object.callee);
	};

	nocturne.isNumber = function(object){
		return (object === +object) || (toString.call(object) === '[object Number]');
	};

	nocturne.bind = function(fn, object){
		var slice = Array.prototype.slice,
			args = slice.apply(arguments, [2]);

		return function(){
			return fn.apply(object || {}, args.concat(slice.apply(arguments)));
		};
	};

	if (global.nocturne){
		throw new Error('nocturne has already been defined');
	}else {
		global.nocturne = nocturne;
	}
})(typeof window === 'undefined' ? this : window);
nocturne.Class = function(){
	return nocturne.oo.create.apply(this, arguments);
}

nocturne.oo = {
	create: function(){
		var methods = null,
			parent = undefined,
			klass = function(){
				this.$super = function(method, args){
					return nocturne.oo.$super(this.$parent, this, method, args);
				};
				this.initialize.apply(this, arguments);
			};

		if (typeof arguments[0] === 'function'){
			parent = arguments[0];
			methods = arguments[1];
		}else {
			methods = arguments[0];
		}

		if (typeof parent !== 'undefined'){
			nocturne.oo.extend(klass.prototype, parent.prototype);
			klass.prototype.$parent = parent.prototype;
		}

		nocturne.oo.mixin(klass, methods);
		nocturne.oo.extend(klass.prototype, methods);
		klass.prototype.constructor = klass;

		if (!klass.prototype.initialize){
			klass.prototype.initialize = function(){};
		}

		return klass;
	},

	mixin: function(klass, methods){
		if (typeof methods.include !== 'undefined'){
			if (typeof methods.include === 'function'){
				nocturne.oo.extend(klass.prototype, methods.include.prototype);
			}else {
				for (var i = 0; i < methods.include.length; i++){
					nocturne.oo.extend(klass.prototype, methods.include[i].prototype);
				}
			}
		}
	},

	extend: function(destination, source){
		for (var property in source){
			destination[property] = source[property];
		}
		return destination;
	},

	$super: function(parentClass, instance, method, args){
		return parentClass[method].apply(instance, args);
	}
};
nocturne.enumerable = {
	Break: {},

	each: function(enumerable, callback, context){
		try {
			if (Array.prototype.forEach && enumerable.forEach === Array.prototype.forEach){
				enumerable.forEach(callback, context);
			}else if (nocturne.isNumber(enumerable.length)){
				for (var i = 0, l = enumerable.length; i < l; i++){
					callback.call(enumerable, enumerable[i], i, enumerable);
				}
			}else {
				for (var key in enumerable){
					if (hasOwnProperty.call(enumerable, key)){
						callback.call(enumerable, enumerable[key], key, enumerable);
					}
				}
			}
		}catch(e){
			if (e != nocturne.enumerable.Break){
				throw e;
			}
		}

		return enumerable;
	},

	map: function(enumerable, callback, context){
		if (Array.prototype.map && enumerable.map === Array.prototype.map){
			return enumerable.map(callback, context);
		}
		var results = [];
		nocturne.enumerable.each(enumerable, function(value, index, list){
			results.push(callback.call(context, value, index, list));
		});
		return results;
	},

	filter: function(enumerable, callback, context){
		if (Array.prototype.filter && enumerable.filter === Array.prototype.filter){
			return enumerable.filter(callback, context);
		}

		var results = [],
			pushIndex = !nocturne.isArray(enumerable);

		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (callback.call(context, value, index, list)){
				if (pushIndex){
					results.push([index, value]);
				}else {
					results.push(value);
				}
			}
		});

		return results;
	},

	reject: function(enumerable, callback, context){
		return this.filter(enumerable, function(){
			return !callback.apply(context, arguments);
		}, context);
	},

	reduce: function(enumerable, memo, callback, context){
		if (Array.prototype.reduce && enumerable.reduce === Array.prototype.reduce){
			return enumerable.reduce(nocturne.bind(callback, context), memo);
		}
		nocturne.enumerable.each(enumerable, function(value, index, list){
			memo = callback.call(context, memo, value, index, list);
		});
		return memo;
	},

	flatten: function(array){
		return nocturne.enumerable.reduce(array, [], function(memo, value){
			if (nocturne.isArray(value)){
				return memo.concat(nocturne.enumerable.flatten(value));
			}
			memo.push(value);
			return memo;
		});
	},

	tail: function(enumerable, start){
		start = typeof start === 'undefined' ? 1: start;
		return Array.prototype.slice.apply(enumerable, [start]);
	},

	invoke: function(enumerable, method){
		var args = nocturne.enumerable.tail(arguments, 2);
		return nocturne.enumerable.map(enumerable, function(value){
			return (method ? value[method] : value).apply(value, args);
		});
	},

	pluck: function(enumerable, key){
		return nocturne.enumerable.map(enumerable, function(value){
			return value[key];
		});
	},

	some: function(enumerable, callback, context){
		callback = callback || nocturne.enumerable.identity;
		if (Array.prototype.some && enumerable.some === Array.prototype.some){
			return enumerable.some(callback, context);
		}
		var result = false;
		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (result = callback.call(context, value, index, list)){
				throw nocturne.enumerable.Break;
			}
		});
		return result;
	},

	detect: function(enumerable, callback, context){
		var result;
		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (callback.call(context, value, index, list)){
				result = value;
				throw nocturne.enumerable.Break;
			}
		});
		return result;
	},

	chain: function(enumerable){
		return new nocturne.enumerable.Chainer(enumerable);
	},

	identity: function(value){
		return value;
	},

	all: function(enumerable, callback, context){
		callback = callback || nocturne.enumerable.identity;
		if (Array.prototype.every && enumerable.every === Array.prototype.every){
			return enumerable.every(callback, context);
		}
		var result = true;
		nocturne.enumerable.each(enumerable, function(value, index, list){
			if (!(result = result && callback.call(context, value, index, list))){
				throw nocturne.enumerable.Break;
			}
		});
		return result;
	},

	include: function(enumerable, target){
		if (Array.prototype.indexOf && enumerable.indexOf === Array.prototype.indexOf){
			return enumerable.indexOf(target) != -1;
		}
		var found = false;
		nocturne.enumerable.each(enumerable, function(value, key){
			if (found = value === target){
				throw nocturne.enumerable.Break;
			}
		});
		return found;
	},
};

//Alias
nocturne.enumerable.select = nocturne.enumerable.filter;
nocturne.enumerable.inject = nocturne.enumerable.reduce;
nocturne.enumerable.collect = nocturne.enumerable.map;
nocturne.enumerable.rest = nocturne.enumerable.tail;
nocturne.enumerable.any = nocturne.enumerable.some;
nocturne.enumerable.every = nocturne.enumerable.all;
nocturne.chainableMethods = ['map', 'collect', 'detect', 'filter', 'reduce', 'tail', 'rest', 'reject', 'pluck', 'any', 'some'];


//Chainer class
nocturne.enumerable.Chainer = function(values){
	this.results = values;
};

nocturne.enumerable.Chainer.prototype.values = function(){
	return this.results;
};

nocturne.enumerable.each(nocturne.chainableMethods, function(methodName){
	var method = nocturne.enumerable[methodName];
	nocturne.enumerable.Chainer.prototype[methodName] = function(){
		var args = Array.prototype.slice.call(arguments);
		args.unshift(this.results);
		this.results = method.apply(this, args);
		return this;
	}
});
nocturne.functional = {
	curry: nocturne.bind,

	memorize: function(memo, fn){
		var wrapper = function(n){
			var result = memo[n];
			if (typeof result !== 'number'){
				result = fn(wrapper, n);
				memo[n] = result;
			}
			return result;
		};

		return wrapper;
	}
};
/*
 * CSS2 selectors
 */
(function(){
	var dom = {}, InvalidFinder = Error, macros, rules, tokenMap,
		find, matchMap, findMap, filter, scannerRegExp;

	macros = {
	    'nl':        '\n|\r\n|\r|\f',
	    'w':         '[\s\r\n\f]*',
	    'nonascii':  '[^\0-\177]',
	    'num':       '-?([0-9]+|[0-9]*\.[0-9]+)',
	    'unicode':   '\\[0-9A-Fa-f]{1,6}(\r\n|[\s\n\r\t\f])?',
	    'escape':    '#{unicode}|\\[^\n\r\f0-9A-Fa-f]',
	    'nmchar':    '[_A-Za-z0-9-]|#{nonascii}|#{escape}',
	    'nmstart':   '[_A-Za-z]|#{nonascii}|#{escape}',
	    'ident':     '[-@]?(#{nmstart})(#{nmchar})*',
	    'name':      '(#{nmchar})+',
	    'string1':   '"([^\n\r\f"]|#{nl}|#{nonascii}|#{escape})*"',
	    'string2':   "'([^\n\r\f']|#{nl}|#{nonascii}|#{escape})*'",
	    'string':    '#{string1}|#{string2}'
	};

	rules = {
	    'name and id':    '(#{ident}##{ident})',
	    'id':             '(##{ident})',
	    'class':          '(\\.#{ident})',
	    'name and class': '(#{ident}\\.#{ident})',
	    'element':        '(#{ident})',
	    'pseudo class':   '(:#{ident})'
	};

	function scanner(){
		function replacePattern(pattern, patterns){
			var matched = true, match;
			while (matched){
				match = pattern.match(/#\{([^}]+)\}/);
				if (match && match[1]){
					pattern = pattern.replace(new RegExp('#\{' + match[1] + '\}', 'g'), patterns[match[1]]);
					matched = true;
				}else {
					matched = false;
				}
			}
			return pattern;
		}

		function escapePattern(text){
			return text.replace(/\//g, '//');
		}

		function convertPatterns(){
			var key, pattern, results = {}, patterns, source;

			if (arguments.length === 2){
				source = arguments[0];
				patterns = arguments[1];
			}else {
				source = arguments[0];
				patterns = arguments[0];
			}

			for (key in patterns){
				pattern = escapePattern(replacePattern(patterns[key], source));
				results[key] = pattern;
			}

			return results;
		}

		function joinPatterns(regexps){
			var results = [], key;
			for (key in regexps){
				results.push(regexps[key]);
			}
			return new RegExp(results.join('|'), 'g');
		}

		return joinPatterns(
			convertPatterns(convertPatterns(macros), rules)
		);

	}

	scannerRegExp = scanner();

	find = {
		byId: function(root, id){
			return [root.getElementById(id)];
		},

		byNodeName: function(root, tagName){
			var i, results = [], nodes = root.getElementsByTagName(tagName);
			for (i = 0; i < nodes.length; i++){
				results.push(nodes[i]);
			}
			return results;
		},

		byClassName: function(root, className){
			var i, results = [], nodes = root.getElementsByTagName('*');
			for (i = 0; i < nodes.length; i++){
				if (nodes[i].className.match('\\b' + className + '\\b')){
					results.push(nodes[i]);
				}
			}
			return results;
		}
	};

	findMap = {
		'id': function(root, selector){
			selector = selector.split('#')[1];
			return find.byId(root, selector);
		},

		'name and id': function(root, selector){
			var matches = selector.split('#'), name, id;
			name = matches[0];
			id = matches[1];
			
			return filter.byAttr(find.byId(root, id), 'nodeName', name.toUpperCase());
		},

		'name': function(root, selector){
			return find.byNodeName(root, selector);
		},

		'class': function(root, selector){
			selector = selector.split('\.')[1];
			return find.byClassName(root, selector);
		},

		'name and class': function(root, selector){
			var matches = selector.split('\.'), name, className;
			name = matches[0];
			className = matches[1];

			return filter.byAttr(find.byClassName(root, className), 'nodeName', name.toUpperCase());
		}
	};

	if (typeof document.getElementsByClassName !== 'undefined'){
		find.byClassName = function(root, className){
			return root.getElementsByClassName(className);
		};
	}

	filter = {
		byAttr: function(elements, attribute, value){
			var key, results = [];
			for (key in elements){
				if (elements[key] && elements[key][attribute] === value){
					results.push(elements[key]);
				}
			}
			return results;
		}
	};

	matchMap = {
		'id': function(element, selector){
			selector = selector.split('#')[1];
			return element && element.id === selector;
		},

		'name': function(element, nodeName){
			return element.nodeName === nodeName.toUpperCase();
		},

		'name and id': function(element, selector){
			return matchMap.id(element, selector) && matchMap.name(element, selector.split('#')[0]);
		},

		'class': function(element, selector){
			if (element && element.className){
				selector = selector.split('\.')[1];
				return element.className.match('\\b' + selector + '\\b');
			}
		},

		'name and class': function(element, selector){
			return matchMap['class'](element, selector) && matchMap.name(element, selector.split('\.')[0]);
		}
	};

	function Searcher(root, tokens){
		this.root = root;
		this.key_selector = tokens.pop();
		this.tokens = tokens;
		this.results = [];
	}

	Searcher.prototype.matchesToken = function(element, token){
		if (!matchMap[token.finder]){
			throw new InvalidFinder('Invalid matcher: ' + token.finder);
		}
		return matchMap[token.finder](element, token.identity);
	};

	Searcher.prototype.find = function(token){
		if (!findMap[token.finder]){
			throw new InvalidFinder('Invalid finder: ' + token.finder);
		}
		return findMap[token.finder](this.root, token.identity);
	};

	Searcher.prototype.matchesAllRules = function(element){
		var tokens = this.tokens.slice(), token = tokens.pop(),
			ancestor = element.parentNode, matchFound = false;

		if (!token || !ancestor){
			return false;
		}

		while(ancestor && token){
			if (this.matchesToken(ancestor, token)){
				matchFound = true;
				token = tokens.pop();
			}
			ancestor = ancestor.parentNode;
		}

		return matchFound && tokens.length === 0;
	};

	Searcher.prototype.parse = function(){
		//Find all elements with the key selector
		var i, element, elements = this.find(this.key_selector), results = [];

		//Traverse upwards from each element to see if it matches all of the rules
		for (i = 0; i < elements.length; i++){
			element = elements[i];
			if (this.tokens.length > 0){
				if (this.matchesAllRules(element)){
					results.push(element);
				}
			}else {
				if (this.matchesToken(element, this.key_selector)){
					results.push(element);
				}
			}
		}
		return results;
	};

	Searcher.prototype.values = function(){
		return this.results;
	};

	/*
	 * remove spaces at the front and end.
	 * then replace \n\t\r\f to a single space
	 */
	function normalize(text){
		return text.replace(/^\s+|\s+$/g, '').replace(/[ \t\r\n\f]+/g, ' ');
	}

	//Tokens are used by the Tokenizer
	function Token(identity, finder){
		this.identity = identity;
		this.finder = finder;
	}
	Token.prototype.toString = function(){
		return 'identity: ' + this.identity + ', finder: ' + this.finder;
	};

	//Tokenizer: classify sections of the scanner output
	function Tokenizer(selector){
		this.selector = normalize(selector);
		this.tokens = [];
		this.tokenize();
	}

	//Analize this.selector, give it a classification. eg: 'id' or 'name and id'
	Tokenizer.prototype.tokenize = function(){
		var match, r, finder;

		r = scannerRegExp;
		r.lastIndex = 0;

		while (match = r.exec(this.selector)){
			finder = null;

			if (match[10]){
				finder = 'id';
			}else if (match[1]){
				finder = 'name and id';
			}else if (match[29]){
				finder = 'name';
			}else if (match[15]){
				finder = 'class';
			}else if (match[20]){
				finder = 'name and class';
			}
			this.tokens.push(new Token(match[0], finder));
		}
		return this.tokens;
	};

	Tokenizer.prototype.finders = function(){
		var i, results = [];
		for (i in this.tokens){
			results.push(this.tokens[i].finder);
		}
		return results;
	};

	dom.tokenize = function(selector){
		var tokenizer = new Tokenizer(selector); //one example of selector: .link
		return tokenizer;
	};

	dom.get = function(selector){
		//you give id or class etc. Search will give you dom elements you specified.
		var tokens = dom.tokenize(selector).tokens,
			searcher = new Searcher(document, tokens);

		return searcher.parse();
	};

	nocturne.dom = dom;
})();
(function(){
	var events = {}, cache = [];

	function isValidElement(element){
		return element.nodeType !== 3 && element.nodeType !== 8;
	}

	function stop(event){
		event.preventDefault(event);
		event.stopPropagation(event);
	}

	function fix(event, element){
		if (!event){
			var event = window.event;
		}

		event.stop = function(){
			stop(event);
		};

		if (typeof event.target === 'undefined'){
			event.target = event.srcElement || element;
		}

		if (!event.preventDefault){
			event.preventDefault = function(){
				event.returnValue = false;
			};
		}

		if (!event.stopPropagation){
			event.stopPropagation = function(){
				event.cancelBubble = true;
			};
		}
		
		if (event.target && event.target.nodeType === 3){
			event.target = event.target.parentNode;
		}

		if (event.pageX == null && event.clientX != null){
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
		}

		return event;
	}

	function createResponder(element, handler){
		return function(event){
			fix(event, element);

			return handler(event);
		};
	}

	function removeCachedResponder(element, type, handler){
		var i = 0, responder, j = 0;
		for (j = 0; j < cache.length; j++){
			if (cache[j].element !== element 
				&& cache[j].type !== type
				&& cache[j].handler !== handler){
				cache[i++] = cache[j];
			}else {
				responder = cache[j].responder;
			}
		}
		cache.length = i;
		return responder;
	}

	events.add = function(element, type, handler){
		if (!isValidElement(element)){
			return;
		}

		var responder = createResponder(element, handler);
		cache.push({element: element, type: type,
			handler: handler, responder: responder});

		if(element.addEventListener){
			element.addEventListener(type, responder, false);
		}else if (element.attachEvent){
			element.attachEvent('on' + type, responder);
		}
	};

	events.remove = function(element, type, handler){
		if (!isValidElement(element)){
			return;
		}
		var responder = removeCachedResponder(element, type, handler);

		if (document.removeEventListener){
			element.removeEventListener(type, responder, false);
		}else {
			element.detachEvent('on' + type, responder);
		}
	};

	events.fire = function(element, type){
		var event;
		if (document.createEventObject){
			event = document.createEventObject();
			fix(event, element);
			return element.fireEvent('on' + type, event);
		}else {
			event = document.createEvent('HTMLEvents');
			fix(event, element);
			event.initEvent(type, true, true);
			return !element.dispatchEvent(event);
		}
	};

	nocturne.events = events;

	if (typeof window !== 'undefined' && window.attachEvent && !window.addEventListener){
		window.attachEvent('onunload', function(){
			for (var i = 0; i < cache.length; i++){
				try {
					events.remove(cache[i].element, cache[i].type);
					cache[i] = null;
				}catch(e){
				}
			}
		});
	}
})();
(function(){
	nocturne.aliasFramework = function(){
		var alias = function(){
			return nocturne.dom.get(arguments[0]);
		}

		if (nocturne.enumerable){
			nocturne.enumerable.each(nocturne.enumerable, function(fn, method){
				alias[method] = fn;
			});
		}

		if (nocturne.dom){
			alias.dom = nocturne.dom;
		}

		if (nocturne.events){
			alias.events = nocturne.events;
		}

		return alias;
	};

	eval(nocturne.alias + ' = nocturne.aliasFramework()');
})();
(function() {
  var anim = {},
      easing = {},
	  Chainer,
      opacityType,
	  CSSTransitions = {};

  // These CSS related functions should be moved into nocturne.css
  function camelize(property){
	  return property.replace(/-+(.)?/g, function(match, chr){
		  return chr ? chr.toUpperCase() : '';
	  });
  }

  function getOpacityType(){
	  return (typeof document.body.style.opacity !== 'undefined') ? 'opacity' : 'filter';
  }

  function Color(value) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.value = this.normalise(value);
    this.parse();
  }

  // Based on: http://www.phpied.com/rgb-color-parser-in-javascript/
  Color.matchers = [
    {
      re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
      process: function (bits){
        return [
          parseInt(bits[1]),
          parseInt(bits[2]),
          parseInt(bits[3])
        ];
      }
    },
    {
      re: /^(\w{2})(\w{2})(\w{2})$/,
      example: ['#00ff00', '336699'],
      process: function (bits){
        return [
          parseInt(bits[1], 16),
          parseInt(bits[2], 16),
          parseInt(bits[3], 16)
        ];
      }
    },
    {
      re: /^(\w{1})(\w{1})(\w{1})$/,
      example: ['#fb0', 'f0f'],
      process: function (bits) {
        return [
          parseInt(bits[1] + bits[1], 16),
          parseInt(bits[2] + bits[2], 16),
          parseInt(bits[3] + bits[3], 16)
        ];
      }
    }
  ];

  Color.prototype.normalise = function(value) {
    value.replace(/ /g, '');
    if (value.charAt(0) == '#') {
      value = value.substr(1, 6);
    }
    return value;
  }

  Color.prototype.parse = function() {
    var channels = [], i;
    for (i = 0; i < Color.matchers.length; i++) {
      channels = this.value.match(Color.matchers[i].re);
      if (channels) {
        channels = Color.matchers[i].process(channels);
        this.r = channels[0];
        this.g = channels[1];
        this.b = channels[2];
        break;
      }
    }
    this.validate();
  }

  Color.prototype.validate = function() {
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
  }

  Color.prototype.sum = function() {
    return this.r + this.g + this.b;
  }

  Color.prototype.toString = function() {
    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
  }

  function isColor(value) {
    return typeof value === 'string' && value.match(/(#[a-f|A-F|0-9]|rgb)/);
  }
  
  function parseColor(value) {
    return { value: new Color(value), units: '', transform: colorTransform };
  }

  function numericalTransform(parsedValue, position, easingFunction) {
    return (easingFunction(position) * parsedValue.value);
  }

  function colorTransform(v, position, easingFunction) {
    var colors = [];
    colors[0] = Math.round(v.base.r + (v.direction[0] * (Math.abs(v.base.r - v.value.r) * easingFunction(position))));
    colors[1] = Math.round(v.base.g + (v.direction[1] * (Math.abs(v.base.g - v.value.g) * easingFunction(position))));
    colors[2] = Math.round(v.base.b + (v.direction[2] * (Math.abs(v.base.b - v.value.b) * easingFunction(position))));
    return 'rgb(' + colors.join(', ') + ')';
  }

  function parseNumericalValue(value) {
    var n = (typeof value === 'string') ? parseFloat(value) : value,
        units = (typeof value === 'string') ? value.replace(n, '') : '';
    return { value: n, units: units, transform: numericalTransform };
  }

  function parseCSSValue(value, element, property) {
    if (isColor(value)) {
      var color = parseColor(value), i;
      color.base = new Color(element.style[property]);
      color.direction = [color.base.r < color.value.r ? 1 : -1,
                          color.base.g < color.value.g ? 1 : -1,
                          color.base.b < color.value.b ? 1 : -1];
      return color;
    } else {
      return parseNumericalValue(value);
    }
  }

  function setCSSProperty(element, property, value) {
    if (property == 'opacity' && opacityType == 'filter') {
      element.style[opacityType] = 'alpha(opacity=' + Math.round(value * 100) + ')';
      return element;
    }
    element.style[property] = value;
    return element;
  }

  easing.linear = function(position) {
    return position;
  };

  easing.sine = function(position) {
    return (-Math.cos(position * Math.PI) / 2) + 0.5;
  };

  easing.reverse = function(position) {
    return 1.0 - position;
  };

  easing.spring = function(position) {
    return 1 - (Math.cos(position * Math.PI * 4) * Math.exp(-position * 6))
  };

  easing.bounce = function(position) {
    if (position < (1 / 2.75)) {
      return 7.6 * position * position;
    } else if (position < (2 /2.75)) {
      return 7.6 * (position -= (1.5 / 2.75)) * position + 0.74;
    } else if (position < (2.5 / 2.75)) {
      return 7.6 * (position -= (2.25 / 2.75)) * position + 0.91;
    } else {
      return 7.6 * (position -= (2.625 / 2.75)) * position + 0.98;
    }
  };

  anim.animate = function(element, duration, properties, options) {
    var duration = duration,
        start = (new Date).valueOf(),
        finish = start + duration,
        easingFunction = easing.linear,
        interval;

	if (!opacityType){
		opacityType = getOpacityType();
	}

    options = options || {};
    if (options.hasOwnProperty('easing')) {
      if (typeof options.easing === 'string') {
        easingFunction = easing[options.easing];
      } else if (options.easing) {
        easingFunction = options.easing;
      }
    }

    for (var property in properties) {
      if (properties.hasOwnProperty(property)) {
        properties[property] = parseCSSValue(properties[property], element, property);
        if (property == 'opacity' && opacityType == 'filter') {
          element.style.zoom = 1;
		}else if (CSSTransitions.vendorPrefix && property == 'left' || property == 'top'){
			CSSTransitions.start(element, duration, property, properties[property].value + properties[property].units, options.easing);
			setTimeout(function(){
				CSSTransitions.end(element, property);
			}, duration);
			return;
		}
      }
    }

    interval = setInterval(function() {
      var time = (new Date).valueOf(), position = time > finish ? 1 : (time - start) / duration;

      for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
          setCSSProperty(
            element,
            property,
            properties[property].transform(properties[property], position, easingFunction) + properties[property].units);
        }
      }

      if (time > finish) {
        clearInterval(interval);
      }
    }, 10);
  };

  CSSTransitions = {
	  //CSS3 vendor detection
	  vendors: {
		  //Opera Presto 2.3
		  'opera': {
			  'prefix': '-o-',
			  'detector': function(){
				  try{
					  document.createEvent('OTransitionEvent');
					  return true;
				  }catch(e){
					  return false;
				  }
			  }
		  },

		  //Chrome, Safari
		  'webkit': {
			  'prefix': '-webkit-',
			  'detector': function(){
				  try{
					  document.createEvent('WebKitTransitionEvent');
					  return true;
				  }catch(e){
					  return false;
				  }
			  }
		  },

		  //Firefox
		  'firefox': {
			  'prefix': '-moz-',
			  'detector': function(){
				  var div = document.createElement('div'),
				  	supported = false;
				  if (typeof div.style.MozTransition !== 'undefined'){
					  supported = true;
				  }
				  div = null;
				  return supported;
			  }
		  }
	  },

	  findCSS3VendorPrefix: function(){
		  for (var detector in CSSTransitions.vendors){
			  detector = this.vendors[detector];
			  if (detector['detector']()){
				  return detector['prefix'];
			  }
		  }
	  },

	  vendorPrefix: null,

	  //CSS3 Transitions
	  start: function(element, duration, property, value, easing){
		  element.style[camelize(this.vendorPrefix + 'transition')] = property + ' ' + duration + 'ms ' + (easing || 'linear');
		  element.style[property] = value;
	  },

	  end: function(element, property){
		  element.style[camelize(this.vendorPrefix + 'transition')] = null;
	  }
  };

  CSSTransitions.vendorPrefix = CSSTransitions.findCSS3VendorPrefix();

  // Helpers
  anim.fade = function(element, duration, options, easing) {
    element.style.opacity = options.from;
    return anim.animate(element, duration, { 'opacity': options.to }, { 'easing': options.easing });
  };

  anim.fadeIn = function(element, duration, options) {
    options = options || {};
    options.from = options.from || 0.0;
    options.to = options.to || 1.0;
    return anim.fade(element, duration, options);
  };

  anim.fadeOut = function(element, duration, options) {
    var from;
    options = options || {};
    options.from = options.from || 1.0;
    options.to = options.to || 0.0;

    // Swap from and to
    from = options.from;
    options.from = options.to;
    options.to = from;

    // This easing function reverses the position value and adds from
    options.easing = function(p) { return (1.0 - p) + options.from; };

    return anim.fade(element, duration, options, { 'easing': options.easing });
  };

  anim.highlight = function(element, duration, options) {
    var style = element.currentStyle ? element.currentStyle : getComputedStyle(element, null);
    options = options || {};
    options.from = options.from || '#ff9';
    options.to = options.to || style.backgroundColor;
    options.easing = options.easing || easing.sine;
    duration = duration || 500;
    element.style.backgroundColor = options.from;
    return setTimeout(function() {
      anim.animate(element, duration, { 'backgroundColor': options.to, 'easing': options.easing })
    }, 200);
  };

  anim.move = function(element, duration, options){
	  return anim.animate(element, duration, {'left': options.x, 'top': options.y}, {'easing': options.easing || easing.sine});
  };

  anim.parseColor = function(colorString){
	  return new Color(colorString);
  };

  anim.pause = function(element, duration, options){};

  anim.easing = easing;


  Chainer = function(element){
	  this.element = element;
	  this.position = 0;
  };

  for (methodName in anim){
	  (function(method){
		  var method = anim[methodName];
		  Chainer.prototype[methodName] = function(){
			  var args = Array.prototype.slice.call(arguments);
			  args.unshift(this.element);

			  //Note: the duration needs to be communicated another way
			  //because of defaults (like highlight())
			  this.position += args[1] || 0;
			  setTimeout(function(){
				  method.apply(null, args);
			  }, this.position);
			  return this;
		  };
	  })(methodName);
  }
  
  anim.chain = function(element){
	  return new Chainer(element);
  };

  nocturne.anim = anim;
})();
