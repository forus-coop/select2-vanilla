QUnit.module('Selection containers - Inline search - Accessibility');

var MultipleSelection = window.require('select2/selection/multiple');
var InlineSearch = window.require('select2/selection/search');
var Utils = window.require('select2/utils');
var Options = window.require('select2/options');
var options = new Options({});

QUnit.test('role attribute is set to searchbox', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    selectionElement.querySelector('textarea').getAttribute('role'),
    'searchbox',
    'The search box is marked as a search box'
  );
});

QUnit.test('aria-autocomplete attribute is present', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    selectionElement.querySelector('textarea').getAttribute('aria-autocomplete'),
    'list',
    'The search box is marked as autocomplete'
  );
});

QUnit.test('aria-activedescendant should not be set initially', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  var searchElement = selectionElement.querySelector('textarea');

  assert.ok(
    !searchElement.getAttribute('aria-activedescendant'),
    'The search box should not point to anything when it is first rendered'
  );
});

QUnit.test('aria-activedescendant should be set after highlight', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  container.trigger('results:focus', {
    data: {
      _resultId: 'test'
    }
  });

  var searchElement = selectionElement.querySelector('textarea');

  assert.equal(
    searchElement.getAttribute('aria-activedescendant'),
    'test',
    'The search is pointing to the focused result'
  );
});

QUnit.test('activedescendant should remove if there is no ID', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  var searchElement = selectionElement.querySelector('textarea');
  searchElement.setAttribute('aria-activedescendant', 'test');

  container.trigger('results:focus', {
    data: {}
  });

  assert.ok(
    !searchElement.getAttribute('aria-activedescendant'),
    'There is no result for the search to be pointing to'
  );
});

QUnit.test('aria-activedescendant should be removed when closed', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  var searchElement = selectionElement.querySelector('textarea');
  searchElement.setAttribute('aria-activedescendant', 'something');

  container.trigger('close');

  assert.ok(
    !searchElement.getAttribute('aria-activedescendant'),
    'There is no active descendant when the dropdown is closed'
  );
});

QUnit.test('aria-controls should not be set initially', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  var searchElement = selectionElement.querySelector('textarea');

  assert.ok(
    !searchElement.getAttribute('aria-controls'),
    'The search box should not point to the results when it is first rendered'
  );
});

QUnit.test('aria-controls should be set when opened', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  var searchElement = selectionElement.querySelector('textarea');

  container.trigger('open');

  assert.ok(
    searchElement.getAttribute('aria-controls'),
    'The search should point to the results when it is opened'
  );
});

QUnit.test('aria-controls should be removed when closed', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  var searchElement = selectionElement.querySelector('textarea');
  searchElement.setAttribute('aria-controls', 'something');

  container.trigger('close');

  assert.ok(
    !searchElement.getAttribute('aria-controls'),
    'There are no results for the search box to point to when it is closed'
  );
});

QUnit.test('aria-label attribute is present', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    selectionElement.querySelector('textarea').getAttribute('aria-label'),
    'Search',
    'The search box has a label'
  );
});
