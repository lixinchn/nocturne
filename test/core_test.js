load('riot.js');
Riot.require('../nocturne.core.js');

Riot.context('nocturne.core.js', function(){
	given('the nocturne object', function(){
		should('be global and accessible', nocturne).isNotNull();
		should('return a VERSION', nocturne.VERSION).isNotNull();
		should('be nocturne complete', true).isTrue();
	});
});

Riot.run();
