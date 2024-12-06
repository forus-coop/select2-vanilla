QUnit.module('Selection containers - Managing focus');

var SingleSelection = window.require('select2/selection/single');
var Options = window.require('select2/options');

var options = new Options({});

QUnit.test('close sets the focus to the selection', function (assert) {
  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();
  var selection = new SingleSelection(
    document.querySelector('#qunit-fixture .single'),
    options
  );

  var selectionElement = selection.render();
  selection.bind(container, containerElement);

  selection.update([{
    id: 'test',
    text: 'test'
  }]);

  containerElement.appendChild(selectionElement);

  assert.notEqual(
    document.activeElement,
    selectionElement,
    'The selection had focus originally'
  );

  container.trigger('close');

  assert.equal(
    document.activeElement,
    selectionElement,
    'After close, focus must be set to selection'
  );
});
