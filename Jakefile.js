function nodeTasks() {
  var sys = require('sys'),
      path = require('path'),
      fs = require('fs'),
      jsmin = require('jsmin').jsmin;

  desc('Builds build/nocturne.js.');
  task('concat', [], function() {
    var files = ('nocturne.core.js nocturne.oo.js nocturne.enumerable.js '
                + 'nocturne.functional.js nocturne.dom.js nocturne.events.js '
                + 'nocturne.touch.js nocturne.alias.js nocturne.anim.js').split(' '),
        filesLeft = files.length,
        pathName = '.',
        outFile = fs.openSync('build/nocturne.js', 'w+');

    files.forEach(function(fileName) {
      var fileName = path.join(pathName, fileName),
          contents = fs.readFileSync(fileName);
      sys.puts('Read: ' + contents.length + ', written: ' + fs.writeSync(outFile, contents.toString()));
    });
    fs.closeSync(outFile);    
  });

  desc('Minifies!');
  task('minify', [], function() {
    // TODO
  });

  desc('Main build task');
  task('build', ['concat', 'minify'], function() {});
}

function narwhalTasks() {
  var jake = require('jake'),
      shrinksafe = require('minify/shrinksafe'),
      FILE = require('file'),
      SYSTEM = require('system')

  jake.task('concat', function(t) {
    var output = '',
        files = ('nocturne.core.js nocturne.oo.js nocturne.enumerable.js '
                + 'nocturne.functional.js nocturne.dom.js nocturne.events.js '
                + 'nocturne.touch.js nocturne.alias.js nocturne.anim.js').split(' ')

    files.map(function(file) {
      output += FILE.read(file)
    })

    if (!FILE.exists('build')) {
      FILE.mkdir('build')
    }

    FILE.write(FILE.join('build', 'nocturne.js'), output)
  })

  jake.task('minify', function(t) {
    var shrunk = shrinksafe.compress(FILE.read(FILE.join('build', 'nocturne.js')))
    FILE.write(FILE.join('build', 'nocturne.min.js'), shrunk)
  })

  jake.task('build', ['concat', 'minify'])
}

if (typeof global.system === 'undefined') {
  nodeTasks();
} else {
  narwhalTasks();
}
