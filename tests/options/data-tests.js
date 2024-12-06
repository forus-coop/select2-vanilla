QUnit.module('Options - Attributes');

var Options = window.require('select2/options');

QUnit.test('no nesting', function (assert) {
  var testElement = document.createElement('select');
  testElement.setAttribute('data-test', 'test');

  var options = new Options({}, testElement);
  assert.equal(options.get('test'), 'test');
});

QUnit.test('with nesting', function (assert) {
  var testElement = document.createElement('select');
  testElement.setAttribute('data-first--second', 'test');
  if (testElement.dataset == null) {
    assert.ok(
      true,
      'We can not run this test if dataset is not implemented'
    );

    return;
  }

  var options = new Options({}, testElement);
  assert.ok(!(options.get('first-Second')));
  assert.equal(options.get('first').second, 'test');
});

QUnit.test('overrides initialized data', function (assert) {
  var testElement = document.createElement('select');
  testElement.setAttribute('data-override', 'yes');
  testElement.setAttribute('data-data', 'yes');

  var options = new Options({
    options: 'yes',
    override: 'no'
  }, testElement);

  assert.equal(options.get('options'), 'yes');
  assert.equal(options.get('override'), 'yes');
  assert.equal(options.get('data'), 'yes');
});
