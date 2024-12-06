QUnit.module('Data adapters - Array');

var ArrayData = require('select2/data/array');
var Options = require('select2/options');
var Utils = require('select2/utils');

var UserDefinedType = function (id, text) {
  this.id = id;
  this.text = text;
};

var arrayOptions = new Options({
  data: [
    { id: 'default', text: 'Default' },
    { id: '1', text: 'One' },
    { id: '2', text: '2' },
    new UserDefinedType(1, 'aaaaaa'),
  ],
});

QUnit.test('current gets default for single', function (assert) {
  // Set up a single select element
  var fixture = document.getElementById('qunit-fixture');
  var select = document.createElement('select');
  select.className = 'single-empty';
  fixture.appendChild(select);

  var data = new ArrayData(select, arrayOptions);
  var container = new MockContainer();
  data.bind(container, document.createElement('div'));

  // Assert the default value
  data.current(function (val) {
    assert.equal(val.length, 1, 'There should always be a selected item for array data.');
    var item = val[0];
    assert.equal(item.id, 'default', 'The first item should be selected');
  });
});

QUnit.test('current gets default for multiple', function (assert) {
  // Set up a multiple select element
  var fixture = document.getElementById('qunit-fixture');
  var select = document.createElement('select');
  select.multiple = true;
  select.className = 'multiple';
  fixture.appendChild(select);

  var data = new ArrayData(select, arrayOptions);
  var container = new MockContainer();
  data.bind(container, document.createElement('div'));

  // Assert no default selection
  data.current(function (val) {
    assert.equal(val.length, 0, 'There should be no default selection.');
  });
});

QUnit.test('select works for single', function (assert) {
  // Set up a single select element
  var fixture = document.getElementById('qunit-fixture');
  var select = document.createElement('select');
  select.className = 'single-empty';
  fixture.appendChild(select);

  var data = new ArrayData(select, arrayOptions);
  var container = new MockContainer();
  data.bind(container, document.createElement('div'));

  assert.equal(select.value, 'default', 'There should already be a selection');

  data.select({ id: '1', text: 'One' });

  assert.equal(select.value, '1', 'The selected value should be the same as the selected id');
});

QUnit.test('option tags are automatically generated', function (assert) {
  // Set up a single select element
  var fixture = document.getElementById('qunit-fixture');
  var select = document.createElement('select');
  select.className = 'single-empty';
  fixture.appendChild(select);

  var data = new ArrayData(select, arrayOptions);
  var container = new MockContainer();
  data.bind(container, document.createElement('div'));

  // Assert the number of option elements created
  var options = select.querySelectorAll('option');
  assert.equal(options.length, 4, 'An <option> element should be created for each object');
});
