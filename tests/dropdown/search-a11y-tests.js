QUnit.module('Dropdown - Search - Accessibility');

var Utils = window.require('select2/utils');

var Dropdown = window.require('select2/dropdown');
var DropdownSearch = Utils.Decorate(
  Dropdown,
  window.require('select2/dropdown/search')
);

var Options = window.require('select2/options');
var options = new Options({});

QUnit.test('role attribute is set to searchbox', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  assert.equal(
    dropdownElement.querySelector('input').getAttribute('role'),
    'searchbox',
    'The search box is marked as a search box'
  );
});

QUnit.test('aria-autocomplete attribute is present', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  assert.equal(
    dropdownElement.querySelector('input').getAttribute('aria-autocomplete'),
    'list',
    'The search box is marked as autocomplete'
  );
});

QUnit.test('aria-activedescendant should not be set initially', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  var search = dropdownElement.querySelector('input');

  assert.ok(
    !search.getAttribute('aria-activedescendant'),
    'The search box should not point to anything when it is first rendered'
  );
});

QUnit.test('aria-activedescendant should be set after highlight', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  container.trigger('results:focus', {
    data: {
      _resultId: 'test'
    }
  });

  var search = dropdownElement.querySelector('input');

  assert.equal(
    search.getAttribute('aria-activedescendant'),
    'test',
    'The search is pointing to the focused result'
  );
});

QUnit.test('activedescendant should remove if there is no ID', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  var search = dropdownElement.querySelector('input');
  search.setAttribute('aria-activedescendant', 'test');

  container.trigger('results:focus', {
    data: {}
  });

  assert.ok(
    !search.getAttribute('aria-activedescendant'),
    'There is no result for the search to be pointing to'
  );
});

QUnit.test('aria-activedescendant should be removed when closed', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  var search = dropdownElement.querySelector('input');
  search.setAttribute('aria-activedescendant', 'something');

  container.trigger('close');

  assert.ok(
    !search.getAttribute('aria-activedescendant'),
    'There is no active descendant when the dropdown is closed'
  );
});

QUnit.test('aria-controls should not be set initially', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  var search = dropdownElement.querySelector('input');

  assert.ok(
    !search.getAttribute('aria-controls'),
    'The search box should not point to the results when it is first rendered'
  );
});

QUnit.test('aria-controls should be set when opened', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  var search = dropdownElement.querySelector('input');

  container.trigger('open');

  assert.ok(
    search.getAttribute('aria-controls'),
    'The search should point to the results when it is opened'
  );
});

QUnit.test('aria-controls should be removed when closed', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  var search = dropdownElement.querySelector('input');
  search.setAttribute('aria-controls', 'something');

  container.trigger('close');

  assert.ok(
    !search.getAttribute('aria-controls'),
    'There are no results for the search box to point to when it is closed'
  );
});

QUnit.test('aria-label attribute is present', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  assert.equal(
    dropdownElement.querySelector('input').getAttribute('aria-label'),
    'Search',
    'The search box has a label'
  );
});
