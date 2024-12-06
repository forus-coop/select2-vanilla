QUnit.module('Selection containers - Placeholders - Allow clear');

var Placeholder = window.require('select2/selection/placeholder');
var AllowClear = window.require('select2/selection/allowClear');

var SingleSelection = window.require('select2/selection/single');
var MultipleSelection = window.require('select2/selection/multiple');

var Options = window.require('select2/options');
var Utils = window.require('select2/utils');

var AllowClearPlaceholder = Utils.Decorate(
  Utils.Decorate(SingleSelection, Placeholder),
  AllowClear
);

var allowClearOptions = new Options({
  placeholder: {
    id: 'placeholder',
    text: 'This is the placeholder'
  },
  allowClear: true
});

QUnit.test('clear is not displayed for single placeholder', function (assert) {
  var selection = new AllowClearPlaceholder(
    document.querySelector('#qunit-fixture .single-with-placeholder'),
    allowClearOptions
  );

  var selectionElement = selection.render();

  selection.update([{
    id: 'placeholder'
  }]);

  assert.equal(
    selectionElement.querySelectorAll('.select2-selection__clear').length,
    0,
    'The clear icon should not be displayed'
  );
});

QUnit.test('clear is not displayed for multiple placeholder', function (assert) {
  var selection = new AllowClearPlaceholder(
    document.querySelector('#qunit-fixture .multiple'),
    allowClearOptions
  );

  var selectionElement = selection.render();

  selection.update([]);

  assert.equal(
    selectionElement.querySelectorAll('.select2-selection__clear').length,
    0,
    'The clear icon should not be displayed'
  );
});

QUnit.test('clear is displayed for placeholder', function (assert) {
  var selection = new AllowClearPlaceholder(
    document.querySelector('#qunit-fixture .single-with-placeholder'),
    allowClearOptions
  );

  var selectionElement = selection.render();

  selection.update([{
    id: 'one',
    text: 'one'
  }]);

  assert.equal(
    selectionElement.querySelectorAll('.select2-selection__clear').length,
    1,
    'The clear icon should be displayed'
  );
});

QUnit.test('clear icon should have title displayed', function (assert) {
  var selection = new AllowClearPlaceholder(
    document.querySelector('#qunit-fixture .single-with-placeholder'),
    allowClearOptions
  );

  var selectionElement = selection.render();

  selection.update([{
    id: 'one',
    text: 'one'
  }]);

  assert.equal(
    selectionElement.querySelector('.select2-selection__clear').getAttribute('title'),
    'Remove all items',
    'The clear icon should have title displayed'
  );
});

QUnit.test('clicking clear will set the placeholder value', function (assert) {
  var element = document.querySelector('#qunit-fixture .single-with-placeholder');

  var selection = new AllowClearPlaceholder(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var selectionElement = selection.render();

  selection.bind(container, document.createElement('div'));

  element.value = 'One';
  selection.update([{
    id: 'One',
    text: 'One'
  }]);

  var removeElement = selectionElement.querySelector('.select2-selection__clear');
  removeElement.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
  assert.equal(
    element.value,
    'placeholder',
    'The value should have been reset to the placeholder'
  );
});

QUnit.test('clicking clear will trigger the unselect event', function (assert) {
  assert.expect(3);

  var element = document.querySelector('#qunit-fixture .single-with-placeholder');

  var selection = new AllowClearPlaceholder(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var selectionElement = selection.render();

  selection.bind(container, document.createElement('div'));

  element.value = 'One';
  selection.update([{
    id: 'One',
    text: 'One'
  }]);

  selection.on('unselect', function (ev) {
    assert.ok(
      'data' in ev && ev.data,
      'The event should have been triggered with the data property'
    );

    assert.ok(
      typeof ev.data === 'object',
      'The data should be an object'
    );

    assert.equal(
      ev.data.id,
      'One',
      'The data should be the unselected object'
    );

  });
  selection.trigger('unselect', {data: { id: 'One', text: 'One' } });
  var removeElement = selectionElement.querySelector('.select2-selection__clear');
  removeElement.dispatchEvent(new MouseEvent('mousedown'));
});

QUnit.test('preventing the unselect event cancels the clearing', function (assert) {
  var element = document.querySelector('#qunit-fixture .single-with-placeholder');

  var selection = new AllowClearPlaceholder(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var selectionElement = selection.render();

  selection.bind(container, document.createElement('div'));

  element.value = 'One';
  selection.update([{
    id: 'One',
    text: 'One'
  }]);

  selection.on('unselect', function (ev) {
    ev.prevented = true;
  });

  var removeElement = selectionElement.querySelector('.select2-selection__clear');
  removeElement.dispatchEvent(new MouseEvent('mousedown'));

  assert.equal(
    element.value,
    'One',
    'The placeholder should not have been set'
  );
});

QUnit.test('clicking clear will trigger the clear event', function (assert) {
  assert.expect(4);

  var element = document.querySelector('#qunit-fixture .single-with-placeholder');

  var selection = new AllowClearPlaceholder(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var selectionElement = selection.render();

  selection.bind(container, document.createElement('div'));

  element.value = 'One';
  selection.update([{
    id: 'One',
    text: 'One'
  }]);
  selection.on('clear', function (ev) {
    assert.ok(
      'data' in ev && ev.data,
      'The event should have been triggered with the data property'
    );

    assert.ok(
      Array.isArray(ev.data),
      'The data should be an array'
    );

    assert.equal(
      ev.data.length,
      1,
      'The data should contain one item for each value'
    );

    assert.equal(
      ev.data[0].id,
      'One',
      'The data should contain unselected objects'
    );
  });
  selection.trigger('clear', {data: [{ id: 'One', text: 'One' }] });
  var removeElement = selectionElement.querySelector('.select2-selection__clear');
  removeElement.dispatchEvent(new MouseEvent('mousedown'));
});

QUnit.test('preventing the clear event cancels the clearing', function (assert) {
  var element = document.querySelector('#qunit-fixture .single-with-placeholder');

  var selection = new AllowClearPlaceholder(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var selectionElement = selection.render();

  selection.bind(container, document.createElement('div'));

  element.value = 'One';
  selection.update([{
    id: 'One',
    text: 'One'
  }]);

  selection.on('clear', function (ev) {
    ev.prevented = true;
  });

  var removeElement = selectionElement.querySelector('.select2-selection__clear');
  removeElement.dispatchEvent(new MouseEvent('mousedown'));

  assert.equal(
    element.value,
    'One',
    'The placeholder should not have been set'
  );
});

QUnit.test('clear does not work when disabled', function (assert) {
  var element = document.querySelector('#qunit-fixture .single-with-placeholder');

  var selection = new AllowClearPlaceholder(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var selectionElement = selection.render();

  selection.bind(container, document.createElement('div'));

  selection.update([{
    id: 'One',
    text: 'One'
  }]);

  element.value = 'One';
  selection.options.set('disabled', true);

  var removeElement = selectionElement.querySelector('.select2-selection__clear');
  removeElement.dispatchEvent(new MouseEvent('mousedown'));

  assert.equal(
    element.value,
    'One',
    'The placeholder should not have been set'
  );
});

QUnit.test('clear button doesnt visually break selected options', function (assert) {
  var element = document.createElement('select');

  var Selection = Utils.Decorate(
    Utils.Decorate(MultipleSelection, Placeholder),
    AllowClear
  );

  var selection = new Selection(
    element,
    allowClearOptions
  );
  var container = new MockContainer();

  var containerElement = document.createElement('span');
  containerElement.className = 'select2-container select2-container--default';
  document.getElementById('qunit-fixture').appendChild(containerElement);

  var selectionElement = selection.render();
  containerElement.appendChild(selectionElement);
  containerElement.style.width = '100px';

  selection.bind(container, containerElement);

  selection.update([{
    id: '1',
    text: '1'
  }]);

  var singleHeight = containerElement.offsetHeight;

  selection.update([
    {
      id: '10',
      text: '10'
    },
    {
      id: '20',
      text: '20'
    }
  ]);

  var doubleHeight = containerElement.offsetHeight;

  selection.update([
    {
      id: '1',
      text: '1'
    },
    {
      id: '2',
      text: '2'
    }
  ]);

  assert.notEqual(
    singleHeight,
    doubleHeight,
    'The height of the two different rows should be different'
  );

  assert.equal(
    containerElement.offsetHeight,
    doubleHeight,
    'There should be two full lines of selections'
  );
});
