load('riot.js');
Riot.require('../nocturne.core.js');
Riot.require('../nocturne.dom.js');
Riot.require('../nocturne.events.js');

Riot.context('nocturne.events.js', function(){
	given('an element', function(){
		var element = nocturne.dom.get('#events-test a')[0],
			check = 0,
			callback = function(e){
				check++;
				return false;
			};

		should('add onclick', function(){
			check = 0;
			nocturne.events.add(element, 'click', callback);
			nocturne.events.fire(element, 'click');
			nocturne.events.remove(element, 'click', callback);
			return check;
		}).equals(1);

		should('remove onclick', function(){
			check = 0;
			nocturne.events.add(element, 'click', callback);
			nocturne.events.fire(element, 'click');
			nocturne.events.remove(element, 'click', callback);
			nocturne.events.fire(element, 'click');
			return check;
		}).equals(1);
	});

	given('a container element', function(){
		should('set the correct element in event.target', function(){
			var lastResult = '',
				callback = function(event){
					lastResult = event.target.innerHTML;
				};

			nocturne.events.add(document, 'click', callback);
			nocturne.events.fire(nocturne.dom.get('.clickme')[0], 'click');
			return lastResult;
		}).equals('Text');
	});
});
Riot.run();
