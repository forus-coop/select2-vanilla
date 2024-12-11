QUnit.module('Selection containers - Single');

var SingleSelection = window.require('select2/selection/single');
var Options = window.require('select2/options');
var Utils = window.require('select2/utils');

var options = new Options({});

QUnit.test('display uses templateSelection', function (assert) {
  var called = false;

  var templateOptions = new Options({
    templateSelection: function (data) {
      called = true;

      return data.text;
    }
  });

  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    templateOptions
  );

  var out = selection.display({
    text: 'test'
  });

  assert.ok(called);

  assert.equal(out, 'test');
});

QUnit.test('templateSelection can addClass', function (assert) {
  var called = false;

  var templateOptions = new Options({
    templateSelection: function (data, container) {
      called = true;
      container.classList.add('testclass');
      return data.text;
    }
  });

  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    templateOptions
  );

  var container = selection.selectionContainer();

  var out = selection.display({
    text: 'test'
  }, container);

  assert.ok(called);

  assert.equal(out, 'test');

  assert.ok(container.classList.contains('testclass'));
});

QUnit.test('empty update clears the selection', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  renderedElement.textContent = 'testing';

  selection.update([]);

  assert.equal(
    renderedElement.textContent,
    '',
    'There should have been nothing rendered'
  );
});

QUnit.test('empty update clears the selection title', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  renderedElement.setAttribute('title', 'testing');

  selection.update([]);

  assert.equal(
    renderedElement.getAttribute('title'),
    null,
    'The title should be removed if nothing is rendered'
  );
});

QUnit.test('update renders the data text', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  selection.update([{
    text: 'test'
  }]);

  assert.equal(renderedElement.textContent, 'test');
});

QUnit.test('update sets the title to the data text', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  selection.update([{
    text: 'test'
  }]);

  assert.equal(
    renderedElement.getAttribute('title'),
    'test',
    'The title should have been set to the text'
  );
});

QUnit.test('update sets the title to the data title', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  selection.update([{
    text: 'test',
    title: 'correct'
  }]);

  assert.equal(
    renderedElement.getAttribute('title'),
    'correct',
    'The title should have taken precedence over the text'
  );
});

QUnit.test('update should clear title for placeholder options', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  renderedElement.setAttribute('title', 'testing');

  selection.update([{
    id: '',
    text: ''
  }]);

  assert.equal(
    renderedElement.getAttribute('title'),
    null,
    'The title should be removed if a placeholder is rendered'
  );
});

QUnit.test('update should clear title for options without text', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  renderedElement.setAttribute('title', 'testing');

  selection.update([{
    id: ''
  }]);

  assert.equal(
    renderedElement.getAttribute('title'),
    null,
    'The title should be removed if there is no text or title property'
  );
});

QUnit.test('escapeMarkup is being used', function (assert) {
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  var unescapedText = '<script>bad("stuff");</script>';

  selection.update([{
    text: unescapedText
  }]);

  assert.equal(
    renderedElement.textContent,
    unescapedText,
    'The text should be escaped by default to prevent injection'
  );
});
