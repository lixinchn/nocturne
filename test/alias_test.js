load('riot.js');

document = {};
document.getElementsByTagName = function(){
	return [];
};
document.attachEvent = function(){};

Riot.require('../nocturne.core.js');
Riot.require('../nocturne.oo.js');
Riot.require('../nocturne.enumerable.js');
Riot.require('../nocturne.dom.js');
Riot.require('../nocturne.events.js');
Riot.require('../nocturne.alias.js');

Riot.context('nocturne.alias.js', function(){
	given('the nocturne object', function(){
		should('automatically search for selectors', $t('.selector')).isNotNull();
		should('alias enumerable methods', $t.each).isEqual(nocturne.enumerable.each);
		should('alias dom', $t.dom).isEqual(nocturne.dom);
		should('alias events', $t.events).isEqual(nocturne.events);
	});
});

Riot.run();
