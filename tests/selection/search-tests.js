QUnit.module('Selection containers - Inline search');

var MultipleSelection = window.require('select2/selection/multiple');
var InlineSearch = window.require('select2/selection/search');
var Options = window.require('select2/options');
var Utils = window.require('select2/utils');

var options = new Options({});

QUnit.test('backspace will remove a choice', function (assert) {
  assert.expect(2);

  var KEYS = window.require('select2/keys');

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var element = document.querySelector('#qunit-fixture .multiple');
  var selection = new CustomSelection(element, options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // The unselect event should be triggered at some point
  selection.on('unselect', function () {
    assert.ok(true, 'A choice was unselected');
  });

  // Add some selections and render the search
  selection.update([
    {
      id: '1',
      text: 'One'
    }
  ]);

  var searchElement = selectionElement.querySelector('.select2-search--inline');
  var choices = selectionElement.querySelectorAll('.select2-selection__choice');

  assert.ok(searchElement, 'The search was visible');
  assert.ok(choices, 'The choice was rendered');
  // Trigger the backspace on the search
  var backspace = new KeyboardEvent('keydown', {
    key: 'Backspace',
    which: KEYS.BACKSPACE
  });
  searchElement.dispatchEvent(backspace);
});

QUnit.test('backspace will set the search text', function (assert) {
  assert.expect(3);

  var KEYS = window.require('select2/keys');

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var element = document.querySelector('#qunit-fixture .multiple');
  var selection = new CustomSelection(element, options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // Add some selections and render the search
  selection.update([
    {
      id: '1',
      text: 'One'
    }
  ]);
  var searchElement = selectionElement.querySelector('textarea');
  var choices = selectionElement.querySelectorAll('.select2-selection__choice');

  assert.ok(searchElement, 'The search was visible');
  assert.ok(choices, 'The choice was rendered');

  // Trigger the backspace on the search
  var backspace = new KeyboardEvent('keydown', {
    key: 'Backspace',
    which: KEYS.BACKSPACE
  });
  selectionElement.dispatchEvent(backspace);
  assert.equal(searchElement.value, 'One', 'The search text was set');
});

QUnit.test('updating selection does not shift the focus', function (assert) {
  // Check for IE 8, which triggers a false negative during testing
  if (window.attachEvent && !window.addEventListener) {
    // We must expect 0 assertions or the test will fail
    assert.expect(0);
    return;
  }

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var element = document.querySelector('#qunit-fixture .multiple');
  var selection = new CustomSelection(element, options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  containerElement.appendChild(selectionElement);

  var searchElement = selectionElement.querySelector('textarea');
  searchElement.focus();

  assert.ok(searchElement, 'The search was not visible');

  assert.equal(
    document.activeElement,
    searchElement,
    'The search did not have focus originally'
  );

  // Trigger an update, this should redraw the search box
  selection.update([]);

  assert.ok(searchElement, 'The search box disappeared');

  assert.equal(
    document.activeElement,
    searchElement,
    'The search did not have focus after the selection was updated'
  );
});

QUnit.test('the focus event shifts the focus', function (assert) {
  // Check for IE 8, which triggers a false negative during testing
  if (window.attachEvent && !window.addEventListener) {
    // We must expect 0 assertions or the test will fail
    assert.expect(0);
    return;
  }

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var element = document.querySelector('#qunit-fixture .multiple');
  var selection = new CustomSelection(element, options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  containerElement.appendChild(selectionElement);

  // The search should not be automatically focused
  var searchElement = selectionElement.querySelector('textarea');

  assert.notEqual(
    document.activeElement,
    searchElement,
    'The search had focus originally'
  );
  assert.ok(searchElement, 'The search was not visible');

  // Focus the container

  container.trigger('focus');

  // Make sure it focuses the search

  assert.ok(searchElement, 'The search box disappeared');

  assert.equal(
    document.activeElement,
    searchElement,
    'The search did not have focus originally'
  );
});

QUnit.test('search box without text should propagate click', function (assert) {
  assert.expect(1);

  // Select the container and element
  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var element = document.querySelector('#qunit-fixture .multiple');

  var container = new MockContainer();
  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  // Initialize the selection
  var selection = new CustomSelection(element, options);

  // Render and bind the selection
  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // Update the selection to ensure the search box is rendered
  selection.update([]);

  // Append the rendered selection to the container
  containerElement.appendChild(selectionElement);

  // Add the event listener to the selection element
  selectionElement.addEventListener('click', function () {
    assert.ok(true, 'The click event should not have been trapped');
  });

  // Find the search box (textarea) inside the selection
  var searchElement = selectionElement.querySelector('textarea');

  // Simulate a click event on the search box
  searchElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});

QUnit.test('search box with text should not propagate click', function (assert) {
  assert.expect(0);

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var element = document.querySelector('#qunit-fixture .multiple');
  var selection = new CustomSelection(element, options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  containerElement.appendChild(selectionElement);

  selectionElement.addEventListener('click', function () {
    assert.ok(false, 'The click event should have been trapped');
  });

  var searchElement = selectionElement.querySelector('textarea');
  searchElement.value = 'test';
  searchElement.dispatchEvent(new MouseEvent('click'));
});

QUnit.test('search box with text should not close dropdown', function (assert) {
  assert.expect(0);

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);

  var element = document.querySelector('#qunit-fixture .multiple');
  var selection = new CustomSelection(element, options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  // Update the selection so the search is rendered
  selection.update([]);

  // Make it visible so the browser can place focus on the search
  containerElement.appendChild(selectionElement);

  container.on('close', function () {
    assert.ok(false, 'The dropdown should not have closed');
  });

  var searchElement = selectionElement.querySelector('textarea');
  searchElement.value = 'test';
  searchElement.dispatchEvent(new MouseEvent('click'));
});

QUnit.skip('search box defaults autocomplete to off', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, options);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    selectionElement.querySelector('textarea').getAttribute('autocomplete'),
    'off',
    'The search box has autocomplete disabled'
  );
});

QUnit.skip('search box sets autocomplete from options', function (assert) {
  var selectElement = document.querySelector('#qunit-fixture .multiple');

  var autocompleteOptions = new Options({
    autocomplete: 'country-name'
  });

  var CustomSelection = Utils.Decorate(MultipleSelection, InlineSearch);
  var selection = new CustomSelection(selectElement, autocompleteOptions);
  var selectionElement = selection.render();

  var container = new MockContainer();
  selection.bind(container, document.createElement('span'));

  // Update the selection so the search is rendered
  selection.update([]);

  assert.equal(
    selectionElement.querySelector('textarea').getAttribute('autocomplete'),
    'country-name',
    'The search box sets the right autocomplete attribute'
  );
});
