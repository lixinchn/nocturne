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
	    'id and name':    '(#{ident}##{ident})',
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
			return element.id === selector;
		},

		'name': function(element, selector){
			return element.nodeName === selector.toUpperCase();
		},

		'name and id': function(element, selector){
			return matchMap.id(element, selector) && matchMap.name(element, selector);
		},

		'class': function(element, selector){
			selector = selector.split('\.')[1];
			return element.className.match('\\b' + selector + '\\b');
		},

		'name and class': function(element, selector){
			return matchMap['class'](element, selector) && matchMap.name(element, selector);
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
		var tokens = this.tokens, token, ancestor = element;
		token = tokens.pop();
		while ((ancestor = ancestor.parentNode) && token){
			if (this.matchesToken(ancestor, token)){
				token = tokens.pop();
			}
		}

		return tokens.length === 0;
	};

	Searcher.prototype.parse = function(){
		//Find all elements with the key selector
		var i, element, elements = this.find(this.key_selector), results = [];

		//Traverse upwards from each element to see if it matches all of the rules
		for (i = 0; i < elements.length; i++){
			element = elements[i];
			if (this.matchesAllRules(element)){
				results.push(element);
			}
		}
		return results;
	};

	Searcher.prototype.values = function(){
		return this.results;
	};

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
	Tokenizer.prototype.tokenize = function(){
		var match, r, finder;

		r= scannerRegExp;
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
		var tokenizer = new Tokenizer(selector);
		return tokenizer;
	};

	dom.get = function(selector){
		var tokens = dom.tokenize(selector).tokens,
			searcher = new Searcher(document, tokens);

		return searcher.parse();
	};

	nocturne.dom = dom;
})();
