QUnit.module('Results - Accessibility');

var Options = window.require('select2/options');
var Results = window.require('select2/results');

QUnit.test('role of results should be a listbox', function (assert) {
  var results = new Results(document.createElement('select'), new Options({}));

  var resultsElement = results.render();

  assert.equal(resultsElement.getAttribute('role'), 'listbox');
});

QUnit.test('multiple select should have aria-multiselectable', function (assert) {
  var results = new Results(document.createElement('select'), new Options({
    multiple: true
  }));

  var resultsElement = results.render();

  assert.equal(resultsElement.getAttribute('aria-multiselectable'), 'true');
});
