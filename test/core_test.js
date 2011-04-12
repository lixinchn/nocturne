load('riot.js');
Riot.require('../nocturne.core.js');

Riot.context('nocturne.core.js', function(){
	given('the nocturne object', function(){
		should('be global and accessible', nocturne).isNotNull();
		should('return a VERSION', nocturne.VERSION).isNotNull();
		should('be nocturne complete', true).isTrue();
	});

	given('an object', function(){
		var fn = function(n){
			return this.value + 1;
		};
		var item = null;

		function Item(value){
			this.value = value;
		}

		item = new Item(100);

		should('bind correctly', nocturne.bind(fn, item)()).equals(101);
	});
});

Riot.run();
