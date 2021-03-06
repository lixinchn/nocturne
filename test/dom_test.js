load('riot.js');
Riot.require('../nocturne.core.js');
Riot.require('../nocturne.dom.js');
Riot.require('../nocturne.alias.js');

Riot.context('nocturne.dom.js', function(){
	given('a selector to tokenize', function(){
		should('return class for .link', nocturne.dom.tokenize('.link').finders()).equals(['class']);
		should ('return class and name for a.link', nocturne.dom.tokenize('a.link').finders()).equals(['name and class']);
	});

	given('a selector to search for', function(){
		should('find with id', nocturne.dom.get('#dom-test')[0].id).equals('dom-test');
		should('find with id and name', nocturne.dom.get('div#dom-test')[0].id).equals('dom-test');
		should('find with tag name', nocturne.dom.get('a')[0].innerHTML).equals('Example Link');
		should('find with tag name', nocturne.dom.get('p')[0].innerHTML).equals('Text');
		should('find a link', nocturne.dom.get('#dom-test a.link')[0].innerHTML).equals('Example Link');
		should('find a class name by itself', nocturne.dom.get('.example1')[0].nodeName).equals('DIV');
		should('find a nested link', nocturne.dom.get('div#dom-test div p a.link')[0].innerHTML).equals('Example Link');
		should('find a nested tag', nocturne.dom.get('.example3 p')[0].innerHTML).equals('Text');
		should('find a nested tag', nocturne.dom.get('.example3 p').length).equals(1);
	});

	given('a selector that does not match anything', function(){
		should('not find anything', nocturne.dom.get('div#massive-explosion .failEarly p.lease')).equals([]);
	});

	given('chained DOM calls', function(){
		should('find a nested tag', nocturne('.example3').find('p').length).equals(1);
	});

	given('a nested element', function(){
		var element = nocturne.dom.get('#dom-test a.link')[0];
		should('find elements with the right selector', function(){
			return nocturne.dom.findElement(element, '#dom-test a.link', document);
		}).equals(element);
		
		should('not find elements with the wrong selector', function(){
			return nocturne.dom.findElement(nocturne.dom.get('#dom-test .example1 p')[0], 'a.link', document);
		}).equals(undefined);
	});
});

Riot.run();
