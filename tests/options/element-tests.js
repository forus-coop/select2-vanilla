QUnit.module('Options - Copying from element');

var Options = window.require('select2/options');

QUnit.test('copies disabled attribute when set', function (assert) {
  var testElement = document.createElement('select');
  testElement.disabled = true;

  var options = new Options({}, testElement);

  assert.ok(options.get('disabled'));
});

QUnit.test('does not copy disabled attribute when not set', function (assert) {
  var testElement = document.createElement('select');

  var options = new Options({}, testElement);

  assert.ok(!options.get('disabled'));
});

QUnit.test('disabled attribute does not override disable option', function (assert) {
  var testElement = document.createElement('select');
  testElement.disabled = true;

  var options = new Options({
    disabled: false
  }, testElement);

  assert.ok(!options.get('disabled'));
});

QUnit.test('disabled option is synchronized back', function (assert) {
  var testElement = document.createElement('select');
  testElement.disabled = true;

  assert.ok(testElement.disabled);

  var options = new Options({
    disabled: false
  }, testElement);

  assert.ok(!testElement.disabled);
});

QUnit.test('copies multiple attribute when set', function (assert) {
  var testElement = document.createElement('select');
  testElement.multiple = true;

  var options = new Options({}, testElement);

  assert.ok(options.get('multiple'));
});

QUnit.test('does not copy multiple attribute when not set', function (assert) {
  var testElement = document.createElement('select');

  var options = new Options({}, testElement);

  assert.ok(!options.get('multiple'));
});

QUnit.test('multiple attribute does not override multiple option', function (assert) {
  var testElement = document.createElement('select');
  testElement.multiple = true;

  var options = new Options({
    multiple: false
  }, testElement);

  assert.ok(!options.get('multiple'));
});

QUnit.test('multiple option is synchronized back', function (assert) {
  var testElement = document.createElement('select');
  testElement.multiple = true;

  assert.ok(testElement.multiple);

  var options = new Options({
    multiple: false
  }, testElement);

  assert.ok(!testElement.multiple);
});

QUnit.test('copies autocomplete attribute when set', function (assert) {
  var testElement = document.createElement('select');
  testElement.setAttribute('autocomplete', 'country-name');

  if (testElement.autocomplete !== 'country-name') {
    // Browser does not support the autocomplete attribute on a select
    assert.ok(true);
    return;
  }

  var options = new Options({}, testElement);

  assert.equal(options.get('autocomplete'), 'country-name');
});

QUnit.test('does not copy autocomplete attribute when not set', function (assert) {
  var testElement = document.createElement('select');

  var options = new Options({}, testElement);

  assert.equal(options.get('autocomplete'), 'off');
});

QUnit.test('autocomplete attribute does not override option', function (assert) {
  var testElement = document.createElement('select');
  testElement.setAttribute('autocomplete', 'country-name');

  var options = new Options({
    autocomplete: 'organization'
  }, testElement);

  assert.equal(options.get('autocomplete'), 'organization');
});
