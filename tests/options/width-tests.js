QUnit.module('Options - Width');

var Select2 = window.require('select2/core');
var select = new Select2(document.createElement('select'));

QUnit.test('string passed as width', function (assert) {
  var testElement = document.createElement('select');

  var width = select._resolveWidth(testElement, '80%');

  assert.equal(width, '80%');
});

QUnit.test('width from style attribute', function (assert) {
  var testElement = document.createElement('select');
  testElement.style.width = '50%';

  var width = select._resolveWidth(testElement, 'style');

  assert.equal(width, '50%');
});

QUnit.test('width from style returns null if nothing is found', function (assert) {
  var testElement = document.createElement('select');

  var width = select._resolveWidth(testElement, 'style');

  assert.equal(width, null);
});

QUnit.test('width from computed element width', function (assert) {
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.innerHTML = '.css-set-width { width: 500px; }';
  var testElement = document.createElement('select');
  testElement.className = 'css-set-width';

  document.getElementById('qunit-fixture').appendChild(styleElement);
  document.getElementById('qunit-fixture').appendChild(testElement);

  var width = select._resolveWidth(testElement, 'element');

  assert.equal(width, '500px');
});

QUnit.test('resolve gets the style if it is there', function (assert) {
  var testElement = document.createElement('select');
  testElement.style.width = '20%';

  var width = select._resolveWidth(testElement, 'resolve');

  assert.equal(width, '20%');
});

QUnit.test('resolve falls back to element if there is no style', function (assert) {
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.innerHTML = '.css-set-width { width: 500px; }';
  var testElement = document.createElement('select');
  testElement.className = 'css-set-width';

  document.getElementById('qunit-fixture').appendChild(styleElement);
  document.getElementById('qunit-fixture').appendChild(testElement);

  var width = select._resolveWidth(testElement, 'resolve');

  assert.equal(width, '500px');
});

QUnit.test('computedstyle gets the style if parent is invisible', function (assert) {
  var styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.innerHTML = '.css-set-width { width: 500px; }';
  var testContainer = document.createElement('div');
  testContainer.style.display = 'none';
  var testElement = document.createElement('select');
  testElement.className = 'css-set-width';
  testContainer.appendChild(testElement);

  document.getElementById('qunit-fixture').appendChild(styleElement);
  document.getElementById('qunit-fixture').appendChild(testContainer);

  var width = select._resolveWidth(testElement, 'computedstyle');

  assert.equal(width, '500px');
});
