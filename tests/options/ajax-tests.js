QUnit.module('Defaults - Ajax');

QUnit.test('options are merged recursively with default options', function (assert) {
  var defaults = window.require('select2/defaults');

  var ajaxDelay = 250;
  var ajaxUrl = 'http://www.test.com';

  var mergedOptions;


  mergedOptions = defaults.apply({
    ajax: {
      delay: ajaxDelay,
      url: ajaxUrl
    }
  });
  assert.equal(
    mergedOptions.ajax.delay,
    ajaxDelay,
    'Ajax default options are present on the merged options'
  );

  assert.equal(
    mergedOptions.ajax.url,
    ajaxUrl,
    'Ajax provided options are present on the merged options'
  );

  defaults.reset();
});

QUnit.test('more than one default option can be changed via set()', function(assert) {
  var defaults = window.require('select2/defaults');
  var dataDataType = 'xml';
  defaults.set('ajax--data-type', dataDataType);
  assert.equal(
    defaults.defaults.ajax.dataType,
    dataDataType,
    'Both ajax.delay and ajax.dataType present in defaults'
  );
  defaults.reset();
});
