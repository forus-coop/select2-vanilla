QUnit.module('Results - option');

var Options = window.require('select2/options');
var Results = window.require('select2/results');

QUnit.test('disabled property on option is respected - enabled', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optionElement = document.createElement('option');
  var option = results.option({
    element: optionElement
  });

  assert.notEqual(option.getAttribute('aria-disabled'), 'true');
});

QUnit.test('disabled property on option is respected - disabled', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optionElement = document.createElement('option');
  optionElement.disabled = true;
  var option = results.option({
    element: optionElement
  });

  assert.equal(option.getAttribute('aria-disabled'), 'true');
});

QUnit.test('disabled property on enabled optgroup is respected', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optgroupElement = document.createElement('optgroup');
  var option = results.option({
    element: optgroupElement
  });

  assert.notEqual(option.getAttribute('aria-disabled'), 'true');
});

QUnit.test('disabled property on disabled optgroup is respected', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optgroupElement = document.createElement('optgroup');
  optgroupElement.disabled = true;
  var option = results.option({
    element: optgroupElement
  });

  assert.equal(option.getAttribute('aria-disabled'), 'true');
});

QUnit.test('option in disabled optgroup is disabled', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optgroupElement = document.createElement('optgroup');
  optgroupElement.disabled = true;
  var optionElement = document.createElement('option');
  optgroupElement.appendChild(optionElement);
  var option = results.option({
    element: optionElement
  });

  assert.equal(option.getAttribute('aria-disabled'), 'true');
});

QUnit.test('options are not selected by default', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optionElement = document.createElement('option');
  var option = results.option({
    id: 'test',
    element: optionElement
  });

  assert.notOk(option.classList.contains('select2-results__option--selected'));
});

QUnit.test('options with children are given the group role', function(assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optgroupElement = document.createElement('optgroup');
  var option = results.option({
    children: [{
      id: 'test'
    }],
    element: optgroupElement
  });

  assert.equal(option.getAttribute('role'), 'group');
});

QUnit.test('options with children have the aria-label set', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optgroupElement = document.createElement('optgroup');
  var option = results.option({
    children: [{
      id: 'test'
    }],
    element: optgroupElement,
    text: 'test'
  });

  assert.equal(option.getAttribute('aria-label'), 'test');
});

QUnit.test('non-group options are given the option role', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var optionElement = document.createElement('option');
  var option = results.option({
    id: 'test',
    element: optionElement
  });

  assert.equal(option.getAttribute('role'), 'option');
});
