QUnit.module('Dropdown - dropdownCssClass');

var Utils = window.require('select2/utils');
var Options = window.require('select2/options');

var Dropdown = window.require('select2/dropdown');
var DropdownCSS = Utils.Decorate(
  Dropdown,
  window.require('select2/dropdown/dropdownCss')
);

QUnit.test('all classes will be copied if :all: is used', function (assert) {
  var element = document.createElement('select');
  element.className = 'test copy works';
  var options = new Options({
    dropdownCssClass: ':all:'
  });

  var select = new DropdownCSS(element, options);
  var dropdown = select.render();

  assert.ok(dropdown.classList.contains('test'));
  assert.ok(dropdown.classList.contains('copy'));
  assert.ok(dropdown.classList.contains('works'));
  assert.ok(!dropdown.classList.contains(':all:'));
});

QUnit.test(':all: can be used with other classes', function (assert) {
  var element = document.createElement('select');
  element.className = 'test copy works';
  var options = new Options({
    dropdownCssClass: ':all: other'
  });

  var select = new DropdownCSS(element, options);
  var dropdown = select.render();

  assert.ok(dropdown.classList.contains('test'));
  assert.ok(dropdown.classList.contains('copy'));
  assert.ok(dropdown.classList.contains('works'));
  assert.ok(dropdown.classList.contains('other'));
  assert.ok(!dropdown.classList.contains(':all:'));
});

QUnit.test('classes can be passed in as a string', function (assert) {
  var element = document.createElement('select');
  element.className = 'test copy works';
  var options = new Options({
    dropdownCssClass: 'other'
  });

  var select = new DropdownCSS(element, options);
  var dropdown = select.render();

  assert.ok(dropdown.classList.contains('other'));
});
