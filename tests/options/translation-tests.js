var Options = window.require('select2/options');
var Defaults = window.require('select2/defaults');

QUnit.module('Options - Translations', {
  beforeEach: function () {
    Defaults.reset();
  },
  afterEach: function () {
    Defaults.reset();
  }
});

QUnit.test('partial dictionaries are reset when default reset', function (assert) {
  Defaults.set('language', {
    test: 'testing'
  });

  Defaults.reset();

  assert.ok(
    !Defaults.defaults.language.test,
    'The partial dictionary should have been reset'
  );
});

QUnit.test('default language chain is English', function (assert) {
  var element = document.createElement('select');

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['en']
  );
});

QUnit.test(
  'default translation includes all of the required messages',
  function (assert) {
    var element = document.createElement('select');

    var options = new Options({}, element);

    assert.deepEqual(
      Object.keys(options.get('translations').all()),
      [
        'errorLoading',
        'inputTooLong',
        'inputTooShort',
        'loadingMore',
        'maximumSelected',
        'noResults',
        'searching',
        'removeAllItems',
        'removeItem',
        'search'
      ]
    );
  }
);

QUnit.test('partial dictionaries can be passed', function (assert) {
  var element = document.createElement('select');

  var options = new Options({
    language: {
      searching: function () {
        return 'Something';
      }
    }
  }, element);

  var translations = options.get('translations');

  assert.equal(
    translations.get('searching')(),
    'Something',
    'The partial dictionary still overrides translations'
  );

  assert.equal(
    translations.get('noResults')(),
    'No results found',
    'You can still get English translations for keys not passed in'
  );
});

QUnit.test('partial dictionaries can be combined with defaults', function (assert) {
  var element = document.createElement('select');

  Defaults.set('language', {
    test: function () {
      return 'Testing';
    }
  });

  var options = new Options({
    language: {
      searching: function () {
        return 'Something';
      }
    }
  }, element);

  var translations = options.get('translations');

  assert.equal(
    translations.get('searching')(),
    'Something',
    'The partial dictionary still overrides translations'
  );

  assert.equal(
    translations.get('test')(),
    'Testing',
    'The defaults were included in the fallback chain'
  );

  assert.equal(
    translations.get('noResults')(),
    'No results found',
    'You can still get English translations for keys not passed in'
  );
});

QUnit.test('partial dictionaries can used in fallback chains', function (assert) {
  var element = document.createElement('select');

  var options = new Options({
    language: [
      {
        searching: function () {
          return 'Something';
        }
      },
      {
        test: function () {
          return 'Testing';
        }
      }
    ]
  }, element);

  var translations = options.get('translations');

  assert.equal(
    translations.get('searching')(),
    'Something',
    'The partial dictionary still overrides translations'
  );

  assert.equal(
    translations.get('test')(),
    'Testing',
    'The defaults were included in the fallback chain'
  );

  assert.equal(
    translations.get('noResults')(),
    'No results found',
    'You can still get English translations for keys not passed in'
  );
});

QUnit.test('language can be set via the options', function (assert) {
  var element = document.createElement('select');

  var options = new Options({
    language: 'es'
  }, element);

  assert.deepEqual(
    options.get('language'),
    ['es', 'en']
  );
});

QUnit.test('multi-part language is broken out', function (assert) {
  var element = document.createElement('select');

  var options = new Options({
    language: 'pt-BR'
  }, element);

  assert.deepEqual(
    options.get('language'),
    ['pt-BR', 'pt', 'en']
  );
});

QUnit.test('default language can be set', function (assert) {
  var element = document.createElement('select');

  Defaults.set('language', 'es');

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['es', 'en']
  );
});

QUnit.test('language set via options adds to default chain', function (assert) {
  var element = document.createElement('select');

  Defaults.set('language', 'es');

  var options = new Options({
    language: 'it'
  }, element);

  assert.deepEqual(
    options.get('language'),
    ['it', 'es', 'en']
  );
});

QUnit.test('default language chain can be set', function (assert) {
  var element = document.createElement('select');

  Defaults.set('language', ['es', 'it', 'en']);

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['es', 'it', 'en']
  );
});

QUnit.test('language can be set by lang attr', function (assert) {
  var element = document.createElement('select');
  element.setAttribute('lang', 'es');

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['es', 'en']
  );
});

QUnit.test('language can be inherited by lang attr', function (assert) {
  var container = document.createElement('div');
  container.setAttribute('lang', 'es');
  var element = document.createElement('select');
  container.appendChild(element);

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['es', 'en']
  );
});

QUnit.test('multi-part language can be inherited by lang attr', function (assert) {
  var container = document.createElement('div');
  container.setAttribute('lang', 'pt-BR');
  var element = document.createElement('select');
  container.appendChild(element);

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['pt-BR', 'pt', 'en']
  );
});

QUnit.test('lang attr overrides default language', function (assert) {
  var element = document.createElement('select');
  element.setAttribute('lang', 'it');

  Defaults.set('language', 'es');

  var options = new Options({}, element);

  assert.deepEqual(
    options.get('language'),
    ['it', 'es', 'en']
  );
});
