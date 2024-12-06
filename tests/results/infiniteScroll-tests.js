QUnit.module('Results - Infinite scrolling');

QUnit.test('loadingMore is triggered even without a scrollbar', function (assert) {
  assert.expect(1);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');
  var InfiniteScroll = window.require('select2/dropdown/infiniteScroll');

  var InfiniteScrollResults = Utils.Decorate(Results, InfiniteScroll);

  var selectElement = document.createElement('select');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  var results = new InfiniteScrollResults(selectElement, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  document.getElementById('qunit-fixture').appendChild(results.render());

  results.bind(container, containerElement);

  results.on('query:append', function () {
    assert.ok(true, 'It tried to load more immediately');
  });

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'test',
          text: 'Test'
        }
      ],
      pagination: {
        more: true
      }
    }
  });
});

QUnit.test('loadingMore is not triggered without scrolling', function (assert) {
  assert.expect(0);

  var Utils = window.require('select2/utils');
  var Options = window.require('select2/options');
  var Results = window.require('select2/results');
  var InfiniteScroll = window.require('select2/dropdown/infiniteScroll');

  var InfiniteScrollResults = Utils.Decorate(Results, InfiniteScroll);

  var selectElement = document.createElement('select');
  var containerElement = document.createElement('span');
  var container = new MockContainer();

  var results = new InfiniteScrollResults(selectElement, new Options({}));

  // Fake the data adapter for the `setClasses` method
  results.data = {};
  results.data.current = function (callback) {
    callback([{ id: 'test' }]);
  };

  var resultsElement = results.render();

  document.getElementById('qunit-fixture').appendChild(resultsElement);
  resultsElement.style.maxHeight = '100px';

  results.bind(container, containerElement);

  results.on('query:append', function () {
    assert.ok(false, 'It tried to load more immediately');
  });

  container.trigger('results:all', {
    data: {
      results: [
        {
          id: 'test',
          text: 'Test'
        },
        {
          id: 'test',
          text: 'Test'
        },
        {
          id: 'test',
          text: 'Test'
        },
        {
          id: 'test',
          text: 'Test'
        },
        {
          id: 'test',
          text: 'Test'
        },
        {
          id: 'test',
          text: 'Test'
        },
        {
          id: 'test',
          text: 'Test'
        }
      ],
      pagination: {
        more: true
      }
    }
  });
});
