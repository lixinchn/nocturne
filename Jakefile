var jake = require('jake'),
	shrinksafe = require('minify/shrinksafe'),
	FILE = require('file'),
	SYSTEM = require('system')

jake.task('concat', function(t){
	var output = '',
		files = ('nocturne.core.js nocturne.oo.js nocturne.enumerable.js '
			+ 'nocturne.functional.js nocturne.dom.js nocturne.events.js nocturne.alias.js').split(' ')

		files.map(function(file){
			output += FILE.read(file)
		})

		if (!FILE.exists('build')){
			FILE.mkdir('build')
		}

		FILE.write(FILE.join('build', 'nocturne.js'), output)
})

jake.task('minify', function(t){
	var shrunk = shrinksafe.compress(FILE.read(FILE.join('build', 'nocturne.js')))
	FILE.write(FILE.join('build', 'nocturne.min.js'), shrunk)
})

jake.task('build', ['concat', 'minify'])
