/*jshint browser: true */
QUnit.module('DOM integration');

QUnit.test('adding a new unselected option changes nothing', function (assert) {
  // Any browsers which support mutation observers will not trigger the event
  var expected = 4;
  if (window.MutationObserver) {
    expected = 2;
  } else if (!window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var Options = window.require('select2/options');
  var Select2 = window.require('select2/core');

  var selectElement = document.createElement('select');
  selectElement.innerHTML = '<option>One</option><option>Two</option>';

  document.getElementById('qunit-fixture').appendChild(selectElement);

  var select = new Select2(selectElement);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    assert.equal(
      args.data[0].id,
      'One',
      'The selection changed to something other than One'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    selectElement.value,
    'One'
  );

  var option = document.createElement('option');
  option.textContent = 'Three';

  selectElement.appendChild(option);

  assert.equal(
    selectElement.value,
    'One'
  );

  syncDone();
});

QUnit.test('adding a new selected option changes the value', function (assert) {
  // handle IE 8 not being supported
  var expected = 4;
  if (!window.MutationObserver && !window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var Options = window.require('select2/options');
  var Select2 = window.require('select2/core');

  var selectElement = document.createElement('select');
  selectElement.innerHTML = '<option>One</option><option>Two</option>';

  document.getElementById('qunit-fixture').appendChild(selectElement);

  var select = new Select2(selectElement);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    assert.equal(
      args.data[0].id,
      'Three',
      'The selection did not change to Three'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    selectElement.value,
    'One'
  );

  var option = document.createElement('option');
  option.selected = true;
  option.textContent = 'Three';

  selectElement.appendChild(option);

  assert.equal(
    selectElement.value,
    'Three'
  );

  syncDone();
});

QUnit.test('removing an unselected option changes nothing', function (assert) {
  // Any browsers which support mutation observers will not trigger the event
  var expected = 4;
  if (!window.MutationObserver && !window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var Options = window.require('select2/options');
  var Select2 = window.require('select2/core');

  var selectElement = document.createElement('select');
  selectElement.innerHTML = '<option>One</option><option>Two</option>';

  document.getElementById('qunit-fixture').appendChild(selectElement);

  var select = new Select2(selectElement);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    assert.equal(
      args.data[0].id,
      'One',
      'The selection changed to something other than One'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    selectElement.value,
    'One'
  );

  selectElement.removeChild(selectElement.children[1]);

  assert.equal(
    selectElement.value,
    'One'
  );

  syncDone();
});

QUnit.test('removing a selected option changes the value', function (assert) {
  // handle IE 8 not being supported
  var expected = 3;
  if (!window.MutationObserver && !window.addEventListener) {
    expected = 2;
  }

  assert.expect(expected);

  var asyncDone = null;
  var syncDone = assert.async();

  if (expected != 2) {
    asyncDone = assert.async();
  }

  var Options = window.require('select2/options');
  var Select2 = window.require('select2/core');

  var selectElement = document.createElement('select');
  selectElement.innerHTML = '<option>One</option><option>Two</option>';

  document.getElementById('qunit-fixture').appendChild(selectElement);

  var select = new Select2(selectElement);

  select.on('selection:update', function (args) {
    assert.equal(
      args.data.length,
      1,
      'There was more than one selection'
    );

    if (expected != 2) {
      asyncDone();
    }
  });

  assert.equal(
    selectElement.value,
    'One'
  );

  selectElement.removeChild(selectElement.children[0]);

  assert.equal(
    selectElement.value,
    'Two'
  );

  syncDone();
});

QUnit.test('searching tags does not lose focus', function (assert) {
  assert.expect(1);

  var asyncDone = assert.async();
  var Options = window.require('select2/options');
  var Select2 = window.require('select2/core');

  var selectElement = document.createElement('select');
  selectElement.multiple = true;
  selectElement.innerHTML = '<option value="1">Text1</option><option value="2">Text2</option>';

  document.getElementById('qunit-fixture').appendChild(selectElement);

  var select = new Select2(selectElement, { tags: true });
  var inputEl = select.selection.search;
  inputEl.focus();

  var done = false;
  select.on('selection:update', function() {
    if (!done) {
      assert.equal(document.activeElement, inputEl);
      done = true;
      asyncDone();
    }
  });

  select.selection.trigger('query', { term: 'f' });
  select.selection.trigger('query', { term: 'ff' });
});

QUnit.test('adding multiple options calls selection:update once', function (assert) {
  assert.expect(1);

  var asyncDone = assert.async();

  var Select2 = window.require('select2/core');

  var content = '<select>';
  var options = '';

  for (var i = 0; i < 4000; i++) {
    options += '<option>' + i + '</option>';
  }

  content += options;
  content += '</select>';

  var selectElement = document.createElement('div');
  selectElement.innerHTML = content;

  document.getElementById('qunit-fixture').appendChild(selectElement);

  var select = new Select2(selectElement);

  var eventCalls = 0;

  select.on('selection:update', function () {
    eventCalls++;
  });
  selectElement.innerHTML = options;
  eventCalls++;

  setTimeout(function () {
    assert.equal(
      eventCalls,
      1,
      'selection:update was called more than once'
    );
    asyncDone();
  }, 0);
});
