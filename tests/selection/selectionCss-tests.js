QUnit.module('Dropdown - selectionCssClass');

var Utils = window.require('select2/utils');
var Options = window.require('select2/options');

var SingleSelection = window.require('select2/selection/single');
var SelectionCSS = Utils.Decorate(
  SingleSelection,
  window.require('select2/selection/selectionCss')
);

QUnit.test('all classes will be copied if :all: is used', function (assert) {
  var element = document.createElement('select');
  element.className = 'test copy works';
  var options = new Options({
    selectionCssClass: ':all:'
  });

  var select = new SelectionCSS(element, options);
  var container = select.render();
  assert.ok(container.classList.contains('test'));
  assert.ok(container.classList.contains('copy'));
  assert.ok(container.classList.contains('works'));
  assert.ok(!container.classList.contains(':all:'));
});

QUnit.test(':all: can be used with other classes', function (assert) {
  var element = document.createElement('select');
  element.className = 'test copy works';
  var options = new Options({
    selectionCssClass: ':all: other'
  });

  var select = new SelectionCSS(element, options);
  var container = select.render();
  assert.ok(container.classList.contains('test'));
  assert.ok(container.classList.contains('copy'));
  assert.ok(container.classList.contains('works'));
  assert.ok(container.classList.contains('other'));
  assert.ok(!container.classList.contains(':all:'));
});

QUnit.test('classes can be passed in as a string', function (assert) {
  var element = document.createElement('select');
  element.className = 'test copy works';
  var options = new Options({
    selectionCssClass: 'other'
  });

  var select = new SelectionCSS(element, options);
  var container = select.render();

  assert.ok(container.classList.contains('other'));
  assert.ok(!container.classList.contains('copy'));
});
