QUnit.module('Utils - escapeMarkup');

var Utils = window.require('select2/utils');

QUnit.test('text passes through', function (assert) {
  var text = 'testing this';
  var escaped = Utils.escapeMarkup(text);

  assert.equal(text, escaped);
});

QUnit.test('html tags are escaped', function (assert) {
  var text = '<script>alert("bad");</script>';
  var escaped = Utils.escapeMarkup(text);

  assert.notEqual(text, escaped);
  assert.equal(escaped.indexOf('<script>'), -1);
});

QUnit.test('quotes are killed as well', function (assert) {
  var text = 'testin\' these "quotes"';
  var escaped = Utils.escapeMarkup(text);

  assert.notEqual(text, escaped);
  assert.equal(escaped.indexOf('\''), -1);
  assert.equal(escaped.indexOf('"'), -1);
});

QUnit.test('DocumentFragment options pass through', function (assert) {
  var frag = document.createDocumentFragment();
  var strong = document.createElement('strong');
  strong.textContent = 'test';
  frag.appendChild(strong);

  var escaped = Utils.escapeMarkup(frag);

  assert.equal(frag, escaped);
});
