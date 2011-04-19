Riot.context('nocturne.core.js', function() {
  given('the nocturne object', function() {
    should('be global and accessible', nocturne).isNotNull();
    should('return a VERSION', nocturne.VERSION).isNotNull();
    should('be nocturne complete', true).isTrue();
  });

  given('an object', function() {
    var fn = function(n) { return this.value + 1; },
        item = null;

    function Item(value) {
      this.value = value;
    }

    item = new Item(100);

    should('bind correctly', nocturne.bind(fn, item)()).equals(101);
  });
});

Riot.context('nocturne.dom.js', function() {
  given('a selector to tokenize', function() {
    should('return class for .link', nocturne.dom.tokenize('.link').finders()).equals(['class']);
    should('return class and name for a.link', nocturne.dom.tokenize('a.link').finders()).equals(['name and class']);
  });

  given('a selector to search for', function() {
    should('find with id', nocturne.dom.get('#dom-test')[0].id).equals('dom-test');
    should('find with id and name', nocturne.dom.get('div#dom-test')[0].id).equals('dom-test');
    should('find with tag name', nocturne.dom.get('a')[0].innerHTML).equals('Example Link');
    should('find with tag name', nocturne.dom.get('p')[0].innerHTML).equals('Text');
    should('find a link', nocturne.dom.get('#dom-test a.link')[0].innerHTML).equals('Example Link');
    should('find a class name by itself', nocturne.dom.get('.example1')[0].nodeName).equals('DIV');
    should('find a nested link', nocturne.dom.get('div#dom-test div p a.link')[0].innerHTML).equals('Example Link');
    should('find a nested tag', nocturne.dom.get('.example3 p')[0].innerHTML).equals('Text');
    should('find a nested tag', nocturne.dom.get('.example3 p').length).equals(1);
  });

  given('a selector that does not match anything', function() {
    should('not find anything', nocturne.dom.get('div#massive-explosion .failEarly p.lease')).equals([]);
  });
});

Riot.run();
