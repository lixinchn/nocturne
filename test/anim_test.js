Riot.require('../nocturne.core.js');
Riot.require('../nocturne.anim.js');

Riot.context('nocturne.anim.js', function(){
	given('a box to change', function(){
		nocturne.anim.highlight(document.getElementById('test-results'));
	});

	given('a long hex color', function(){
		should('convert to the correct RGB', nocturne.anim.parseColor('#ff00ff').toString()
		).equals('rgb(255, 0, 255)');
	});

	given('a small hex color', function(){
		should('convert to the correct RGB', nocturne.anim.parseColor('#fff').toString()
		).equals('rgb(255, 255, 255)');
	});

	given('An RGB color', function(){
		should('leave it alone', nocturne.anim.parseColor('rgb(255, 255, 255)').toString()
		).equals('rgb(255, 255, 255)');
	});
});

Riot.run();
