Riot.require('../nocturne.core.js');
Riot.require('../nocturne.anim.js');

Riot.context('nocturne.anim.js', function(){
	given('a box to change', function(){
		var box = document.getElementById('box');
		nocturne.anim.animate(box, 1000, {'marginLeft': '8em', 'marginTop': '100px'});
	});
});

Riot.run();
