QUnit.module('Selection containers - Multiple');

var MultipleSelection = window.require('select2/selection/multiple');
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

  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
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

  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    templateOptions
  );

  var containerElement = selection.selectionContainer();

  var out = selection.display({
    text: 'test'
  }, containerElement);

  assert.ok(called);

  assert.equal(out, 'test');

  assert.ok(containerElement.classList.contains('testclass'));
});

QUnit.test('empty update clears the selection', function (assert) {
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
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
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    options
  );

  var selectionElement = selection.render();

  selection.update([]);

  var renderedElement = selectionElement.querySelector('.select2-selection__rendered li');

  assert.equal(
    renderedElement,
    null,
    'The title should be removed if nothing is rendered'
  );
});

QUnit.test('update sets the title to the data text', function (assert) {
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    options
  );

  var selectionElement = selection.render();

  selection.update([{
    text: 'test'
  }]);

  var renderedElement = selectionElement.querySelector('.select2-selection__rendered li');

  assert.equal(
    renderedElement.getAttribute('title'),
    'test',
    'The title should have been set to the text'
  );
});

QUnit.test('update sets the title to the data title', function (assert) {
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    options
  );

  var selectionElement = selection.render();

  selection.update([{
    text: 'test',
    title: 'correct'
  }]);

  var renderedElement = selectionElement.querySelector('.select2-selection__rendered li');

  assert.equal(
    renderedElement.getAttribute('title'),
    'correct',
    'The title should have taken precedence over the text'
  );
});

QUnit.test('update should clear title for placeholder options', function (assert) {
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    options
  );

  var selectionElement = selection.render();

  selection.update([{
    id: '',
    text: ''
  }]);

  var renderedElement = selectionElement.querySelector('.select2-selection__rendered li');

  assert.equal(
    renderedElement.getAttribute('title'),
    null,
    'The title should be removed if a placeholder is rendered'
  );
});

QUnit.test('update should clear title for options without text', function (assert) {
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    options
  );

  var selectionElement = selection.render();

  selection.update([{
    id: ''
  }]);

  var renderedElement = selectionElement.querySelector('.select2-selection__rendered li');

  assert.equal(
    renderedElement.getAttribute('title'),
    null,
    'The title should be removed if there is no text or title property'
  );
});

QUnit.test('escapeMarkup is being used', function (assert) {
  var selection = new MultipleSelection(
    document.querySelector('#qunit-fixture .multiple'),
    options
  );

  var selectionElement = selection.render();
  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  var unescapedText = '<script>bad("stuff");</script>';

  selection.update([{
    text: unescapedText
  }]);
  var escapedText = Utils.escapeMarkup(unescapedText);
  assert.equal(
    renderedElement.textContent.trim().substr(1), // Skip the first character
    '&lt;script&gt;bad(&quot;stuff&quot;);&lt;&#47;script&gt;',
    'The text should be escaped by default to prevent injection'
  );
});

QUnit.test('clear button respects the disabled state', function (assert) {
  var options = new Options({
    disabled: true
  });

  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var container = new MockContainer();
  var containerElement = document.createElement('div');

  var selection = new MultipleSelection(
    selectElement,
    options
  );

  var selectionElement = selection.render();
  containerElement.appendChild(selectionElement);

  selection.bind(container, containerElement);

  // Select an option
  selection.update([{
    text: 'Test'
  }]);

  var renderedElement = selectionElement.querySelector('.select2-selection__rendered');

  var pillElement = renderedElement.querySelector('.select2-selection__choice');

  assert.ok(pillElement, 'There should only ok one selection');

  var removeElement = pillElement.querySelector('.select2-selection__choice__remove');

  assert.ok(
    removeElement,
    'The remove icon is displayed for the selection'
  );

  // Set up the unselect handler
  selection.on('unselect', function (params) {
    assert.ok(false, 'The unselect handler should not be triggered');
  });

  // Trigger the handler for the remove icon
  removeElement.dispatchEvent(new MouseEvent('click'));
});
