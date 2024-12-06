QUnit.module('Dropdown - Search');

var Dropdown = window.require('select2/dropdown');
var DropdownSearch = Utils.Decorate(
  Dropdown,
  window.require('select2/dropdown/search')
);

var Options = window.require('select2/options');
var Utils = window.require('select2/utils');

var options = new Options({});

QUnit.test('search box defaults autocomplete to off', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var dropdown = new DropdownSearch(select, options);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  assert.equal(
    dropdownElement.querySelector('input').getAttribute('autocomplete'),
    'off',
    'The search box has autocomplete disabled'
  );
});

QUnit.test('search box sets autocomplete from options', function (assert) {
  var select = document.querySelector('#qunit-fixture .single');

  var autocompleteOptions = new Options({
    autocomplete: 'country-name'
  });

  var dropdown = new DropdownSearch(select, autocompleteOptions);
  var dropdownElement = dropdown.render();

  var container = new MockContainer();
  dropdown.bind(container, document.createElement('span'));

  assert.equal(
    dropdownElement.querySelector('input').getAttribute('autocomplete'),
    'country-name',
    'The search box sets the right autocomplete attribute'
  );
});
