QUnit.module('select2(data)');

var Select2 = window.require('select2/core');
var Options = window.require('select2/options');

QUnit.test('single default selection returned', function (assert) {
  var selectElement = document.createElement('select');
  selectElement.innerHTML = '<option>One</option><option>Two</option><option value="3" selected>Three</option>';
  var options = new Options({});

  var select = new Select2(selectElement, options);

  var items = select.data();

  assert.equal(
    items.length,
    1,
    'The one selected item should be returned'
  );

  var first = items[0];

  assert.equal(
    first.id,
    '3',
    'The first option was correct'
  );

  assert.equal(
    first.text,
    'Three',
    'The first option was correct'
  );
});

QUnit.test('multiple default selections returned', function (assert) {
  var selectElement = document.createElement('select');
  selectElement.multiple = true;
  selectElement.innerHTML = '<option selected>One</option><option>Two</option><option value="3" selected>Three</option>';
  var options = new Options({});

  var select = new Select2(selectElement, options);

  var items = select.data();

  assert.equal(
    items.length,
    2,
    'The two selected items should be returned'
  );

  var first = items[0];

  assert.equal(
    first.id,
    'One',
    'The first option was correct'
  );

  var second = items[1];

  assert.equal(
    second.id,
    '3',
    'The option value should be pulled correctly'
  );
});

QUnit.module('select2(val)');

QUnit.test('single value matches DOM value', function (assert) {
  var selectElement = document.createElement('select');
  selectElement.innerHTML = '<option>One</option><option>Two</option><option value="3" selected>Three</option>';
  var options = new Options({});

  var select = new Select2(selectElement, options);

  var value = select.val();
  assert.equal(
    value,
    '3',
    'The value should match the option tag attribute'
  );

  assert.equal(
    value,
    selectElement.value,
    'The value should match the DOM value'
  );
});

QUnit.test('multiple value matches the DOM value', function (assert) {
  var selectElement = document.createElement('select');
  selectElement.multiple = true;
  selectElement.innerHTML = '<option selected>One</option><option>Two</option><option value="3" selected>Three</option>';
  var options = new Options({});

  var select = new Select2(selectElement, options);

  var value = select.val();

  assert.equal(
    value.length,
    2,
    'Two options should be selected'
  );

  assert.deepEqual(
    value,
    ['One', '3'],
    'The values should match the option tag attribute'
  );

  assert.deepEqual(
    value,
    Array.from(selectElement.selectedOptions).map(option => option.value),
    'The values should match the DOM values'
  );
});



