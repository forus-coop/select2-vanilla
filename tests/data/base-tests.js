QUnit.module('Data adapters - Base');

var BaseData = require('select2/data/base');
var Options = require('select2/options');

var options = new Options({});

QUnit.test('current is required', function (assert) {
  // Create a select element and append it to the qunit-fixture
  var select = document.createElement('select');
  document.getElementById('qunit-fixture').appendChild(select);

  var data = new BaseData(select, options);

  assert.throws(
    function () {
      data.current(function () {});
    },
    'current has no default implementation'
  );
});

QUnit.test('query is required', function (assert) {
  // Create a select element and append it to the qunit-fixture
  var select = document.createElement('select');
  document.getElementById('qunit-fixture').appendChild(select);

  var data = new BaseData(select, options);

  assert.throws(
    function () {
      data.query({}, function () {});
    },
    'query has no default implementation'
  );
});
