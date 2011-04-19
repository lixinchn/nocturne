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

	given('a jsonp request', function(){
		nocturne.net.jsonp('http://feeds.delicious.com/v1/json/alex_young/javascript?callback={callback}', {success: function(json){}});
	});
});

Riot.run();
