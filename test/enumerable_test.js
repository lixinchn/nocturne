load('riot.js');
Riot.require('../nocturne.core.js');
Riot.require('../nocturne.enumerable.js');

Riot.context('nocturne.enumerable.js', function(){
	given('an array', function(){
		var a = [1, 2, 3, 4, 5];
		should('iterate with each', function(){
			var count = 0;
			nocturne.enumerable.each(a, function(n){
				count += 1;
			});
			return count;
		}).equals(5);

		should('iterate with map', function(){
			return nocturne.enumerable.map(a, function(n){
				return n + 1;
			});
		}).equals([2, 3, 4, 5, 6]);

		should('filter arrays', function(){
			return nocturne.enumerable.filter(a, function(n){
				return n % 2 == 0;
			});
		}).equals([2, 4]);
	});

	given('an object', function(){
		var obj = {one: '1', two: '2', three: '3'};
		should('iterate with each', function(){
			var count = 0;
			nocturne.enumerable.each(obj, function(n){
				count += 1;
			});
			return count;
		}).equals(3);

		should('iterate with map', function(){
			return nocturne.enumerable.map(obj, function(n){
				return n + 1;
			});
		}).equals(['11', '21', '31']);

		should('filter objects and return a multi-dimensional array', function(){
			return nocturne.enumerable.filter(obj, function(v, i){
				return v < 2;
			})[0][0];
		}).equals('one');
	});
});

Riot.run();
