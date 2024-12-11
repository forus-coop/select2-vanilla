QUnit.module('Selection containers - Stopping event propagation');

var SingleSelection = window.require('select2/selection/single');
var StopPropagation = window.require('select2/selection/stopPropagation');
var Options = window.require('select2/options');
var Utils = window.require('select2/utils');

var CustomSelection = Utils.Decorate(SingleSelection, StopPropagation);

var options = new Options();

QUnit.test('click event does not propagate', function (assert) {
  assert.expect(1);

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var selection = new CustomSelection(document.querySelector('#qunit-fixture select'), options);

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  containerElement.appendChild(selectionElement);
  containerElement.addEventListener('click', function () {
    assert.ok(false, 'The click event should have been stopped');
  });

  var clickEvent = new Event('click', { bubbles: true, cancelable: true });
  selectionElement.dispatchEvent(clickEvent);

  assert.ok(true, 'Something went wrong if this failed');
});
