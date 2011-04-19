load('riot.js');
Riot.require('../nocturne.core.js');
Riot.require('../nocturne.net.js');

Riot.context('nocturne.net.js', function(){
	given('a request', function(){
		var reponse,
			request = nocturne.net.get('/test', {
				'error': function(r) {response = r;}
			});

		should ('generate a request object', request.readyState).isEqual(0);
	});
});

Riot.run();
