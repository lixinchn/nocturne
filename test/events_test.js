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

		should('bind events using the chained API', function(){
			var clicks = 0;
			nocturne('#events-test a').bind('click', function(){
				clicks++;
			});
			nocturne.events.fire(element, 'click');
			return clicks;
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
			nocturne.events.remove(document, 'click', callback);
			return lastResult;
		}).equals('Text');

		should('stop', function(){
			var callback = function(event){
				event.stop();
			};
			nocturne.events.add(nocturne.dom.get('#link2')[0], 'click', callback);
			nocturne.events.fire(nocturne.dom.get('#link2')[0], 'click');
			return window.location.hash;
		}).equals('');
	});
});
Riot.run();
