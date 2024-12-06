QUnit.module('Results - highlighting results');



QUnit.test('results:all triggers results:focus on the first item', function (assert) {
  assert.expect(2);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');

  var selectElement = document.createElement('select');
  var parentElement = document.createElement('div');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  parentElement.appendChild(selectElement);
  document.getElementById('qunit-fixture').appendChild(parentElement);

  var results = new Results(selectElement, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, containerElement);

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'test');
    assert.equal(params.data.text, 'Test');
  });
  results.trigger('results:focus', { data: { id: 'test', text:'Test' } });
  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'test',
          text: 'Test'
        }
      ]
    }
  });
});

QUnit.test('results:append does not trigger results:focus', function (assert) {
  assert.expect(0);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');

  var selectElement = document.createElement('select');
  var parentElement = document.createElement('div');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  parentElement.appendChild(selectElement);
  document.getElementById('qunit-fixture').appendChild(parentElement);

  var results = new Results(selectElement, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, containerElement);

  results.on('results:focus', function () {
    assert.ok(false, 'The results:focus event was triggered');
  });

  container.trigger('results:append', {
    data: {
      results: [
        {
          id: 'test',
          text: 'Test'
        }
      ]
    }
  });
});

QUnit.test('scrollAfterSelect triggers results:focus', function (assert) {
  assert.expect(3);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');

  var selectElement = document.createElement('select');
  var parentElement = document.createElement('div');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  parentElement.appendChild(selectElement);
  document.getElementById('qunit-fixture').appendChild(parentElement);

  var options = new Options({ scrollAfterSelect: true });
  var results = new Results(selectElement, options);

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, containerElement);

  // check that default for scrollAfterSelect is true
  assert.equal(options.get('scrollAfterSelect'), true);

  results.append({
    results: [
      {
        id: 'test',
        text: 'Test'
      }
    ]
  });

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'test');
    assert.equal(params.data.text, 'Test');
  });
  results.trigger('results:focus', { data: { id: 'test', text:'Test' } });
  container.trigger('select', {});
});

QUnit.test('!scrollAfterSelect does not trigger results:focus', function (assert) {
  assert.expect(1);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');

  var selectElement = document.createElement('select');
  var parentElement = document.createElement('div');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  parentElement.appendChild(selectElement);
  document.getElementById('qunit-fixture').appendChild(parentElement);

  var options = new Options({ scrollAfterSelect: false });
  var results = new Results(selectElement, options);

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, containerElement);

  // check that default for scrollAfterSelect is false
  assert.equal(options.get('scrollAfterSelect'), false);

  results.append({
    results: [
      {
        id: 'test',
        text: 'Test'
      }
    ]
  });

  results.on('results:focus', function () {
    assert.ok(false, 'The results:focus event was triggered');
  });

  container.trigger('select', {});
});

QUnit.test('tag result is highlighted with no other selections', function (assert) {
  assert.expect(2);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');
  var Tags = window.require('select2/dropdown/tagsSearchHighlight');
  var TagResults = Utils.Decorate(Results, Tags);

  var selectElement = document.createElement('select');
  var parentElement = document.createElement('div');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  parentElement.appendChild(selectElement);
  document.getElementById('qunit-fixture').appendChild(parentElement);

  var results = new TagResults(selectElement, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([]);
  };

  results.render();

  results.bind(container, containerElement);

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'tag');
    assert.equal(params.data.text, 'Tag');
  });
  results.trigger('results:focus', { data: { id: 'tag', text:'Tag' } });
  var tagElement = document.createElement('option');
  tagElement.setAttribute('data-select2-tag', 'true');

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'tag',
          text: 'Tag',
          element: tagElement
        }
      ]
    }
  });
});

QUnit.test('tag result is highlighted with other selections', function (assert) {
  assert.expect(2);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');
  var Tags = window.require('select2/dropdown/tagsSearchHighlight');
  var TagResults = Utils.Decorate(Results, Tags);

  var selectElement = document.createElement('select');
  var parentElement = document.createElement('div');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  parentElement.appendChild(selectElement);
  document.getElementById('qunit-fixture').appendChild(parentElement);

  var results = new TagResults(selectElement, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  results.render();

  results.bind(container, containerElement);

  results.on('results:focus', function (params) {
    assert.equal(params.data.id, 'test');
    assert.equal(params.data.text, 'Tag');
  });
  results.trigger('results:focus', { data: { id: 'test', text:'Tag' } });
  var tagElement = document.createElement('option');
  tagElement.setAttribute('data-select2-tag', 'true');

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'tag',
          text: 'Tag',
          element: tagElement
        },
        {
          id: 'test',
          text: 'Test'
        }
      ]
    }
  });
});
