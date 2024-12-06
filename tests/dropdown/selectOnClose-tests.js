QUnit.module('Dropdown - selectOnClose');

var Utils = window.require('select2/utils');
var Options = window.require('select2/options');

var SelectData = window.require('select2/data/select');

var Results = window.require('select2/results');
var SelectOnClose = window.require('select2/dropdown/selectOnClose');

var ModifiedResults = Utils.Decorate(Results, SelectOnClose);

var options = new Options({
  selectOnClose: true
});

QUnit.test('will not trigger if no results were given', function (assert) {
  assert.expect(0);

  var element = document.createElement('select');
  var select = new ModifiedResults(element, options, new SelectData(element));

  var dropdown = select.render();

  var container = new MockContainer();
  select.bind(container, document.createElement('div'));

  select.on('select', function () {
    assert.ok(false, 'The select event should not have been triggered');
  });

  container.trigger('close');
});

QUnit.test('will not trigger if the results list is empty', function (assert) {
  assert.expect(1);

  var element = document.createElement('select');
  var select = new ModifiedResults(element, options, new SelectData(element));

  var dropdown = select.render();

  var container = new MockContainer();
  select.bind(container, document.createElement('div'));

  select.on('select', function () {
    assert.ok(false, 'The select event should not have been triggered');
  });

  select.append({
    results: []
  });

  assert.equal(
    dropdown.querySelectorAll('li').length,
    0,
    'There should not be any results in the dropdown'
  );

  container.trigger('close');
});

QUnit.test('will not trigger if no results are highlighted', function (assert) {
  assert.expect(2);

  var element = document.createElement('select');
  var select = new ModifiedResults(element, options, new SelectData(element));

  var dropdown = select.render();

  var container = new MockContainer();
  select.bind(container, document.createElement('div'));

  select.on('select', function () {
    assert.ok(false, 'The select event should not have been triggered');
  });

  select.append({
    results: [
      {
        id: '1',
        text: 'Test'
      }
    ]
  });

  assert.equal(
    dropdown.querySelectorAll('li').length,
    1,
    'There should be one result in the dropdown'
  );

  assert.equal(
    dropdown.querySelector('li').textContent.trim(),
    'Test',
    'The result should be the same as the one we appended'
  );

  container.trigger('close');
});

QUnit.test('will trigger if there is a highlighted result', function (assert) {
  assert.expect(1);

  var element = document.createElement('select');
  var select = new ModifiedResults(element, options, new SelectData(element));

  var dropdown = select.render();

  var container = new MockContainer();
  select.bind(container, document.createElement('div'));

  select.on('select', function () {
    assert.ok(true, 'The select event should have been triggered');
  });

  select.append({
    results: [
      {
        id: '1',
        text: 'Test'
      }
    ]
  });
    assert.equal(
    dropdown.querySelectorAll('li').length,
    1,
    'There should be one result in the dropdown'
  );

});
