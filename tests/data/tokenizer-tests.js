QUnit.module('Data adaptor - Tokenizer');

QUnit.test('triggers the select event', function (assert) {
  assert.expect(2);

  var SelectData = window.require('select2/data/select');
  var Tokenizer = window.require('select2/data/tokenizer');
  var Tags = window.require('select2/data/tags');

  var Options = window.require('select2/options');
  var Utils = window.require('select2/utils');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var select = document.querySelector('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var containerElement = document.createElement('div');

  var data = new TokenizedSelect(select, options);
  data.bind(container, containerElement);

  data.on('select', function () {
    assert.ok(true, 'The select event should be triggered');
  });

  data.query({
    term: 'first,second'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});

QUnit.test('createTag can return null', function (assert) {
  assert.expect(3);

  var SelectData = window.require('select2/data/select');
  var Tokenizer = window.require('select2/data/tokenizer');
  var Tags = window.require('select2/data/tags');

  var Options = window.require('select2/options');
  var Utils = window.require('select2/utils');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var select = document.querySelector('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [','],
    createTag: function () {
      assert.ok(true, 'createTag should have been called');

      return null;
    }
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var containerElement = document.createElement('div');

  var data = new TokenizedSelect(select, options);
  data.bind(container, containerElement);

  data.on('select', function (params) {
    if (params.data == null) {
      assert.ok(false, 'Null data should never be selected');
    }
  });

  data.query({
    term: 'first,second'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});

QUnit.test('createTag returning null does not cut the term', function (assert) {
  assert.expect(4);

  var SelectData = window.require('select2/data/select');
  var Tokenizer = window.require('select2/data/tokenizer');
  var Tags = window.require('select2/data/tags');

  var Options = window.require('select2/options');
  var Utils = window.require('select2/utils');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var select = document.querySelector('#qunit-fixture .single');

  var options = new Options({
    tags: true,
    tokenSeparators: [',', '"'],
    createTag: function (params) {
      var term = params.term;

      // Ignore blanks
      if (term.length === 0) {
        return null;
      }

      // Ignore the leading quote
      if (term === '"') {
        return null;
      }

      // If there is a leading quote, check for a second one
      if (term[0] === '"' && term[term.length - 1] !== '"') {
        return null;
      }

      var text = term.substr(1, term.length - 2);

      return {
        id: term,
        text: text
      };
    }
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var containerElement = document.createElement('div');

  var data = new TokenizedSelect(select, options);
  data.bind(container, containerElement);

  data.on('select', function (params) {
    assert.ok(params.data, 'Data should not be null');

    assert.equal(
      params.data.id,
      '"first, second"',
      'The id should have the quotes'
    );

    assert.equal(
      params.data.text,
      'first, second',
      'The text should not have the quotes'
    );
  });

  data.query({
    term: '"first, second",abc'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });
});

QUnit.test('works with multiple tokens given', function (assert) {
  assert.expect(4);

  var SelectData = window.require('select2/data/select');
  var Tokenizer = window.require('select2/data/tokenizer');
  var Tags = window.require('select2/data/tags');

  var Options = window.require('select2/options');
  var Utils = window.require('select2/utils');

  var TokenizedSelect = Utils.Decorate(
    Utils.Decorate(SelectData, Tags),
    Tokenizer
  );
  var select = document.querySelector('#qunit-fixture .multiple');

  var options = new Options({
    tags: true,
    tokenSeparators: [',']
  });

  var container = new MockContainer();
  container.dropdown = container.selection = {};

  var containerElement = document.createElement('div');

  var data = new TokenizedSelect(select, options);
  data.bind(container, containerElement);

  data.on('select', function () {
    assert.ok(true, 'The select event should be triggered');
  });

  data.query({
    term: 'first,second,third'
  }, function () {
    assert.ok(true, 'The callback should have succeeded');
  });

  assert.equal(
    select.querySelectorAll('option').length,
    3,
    'The two new tags should have been created'
  );
});
