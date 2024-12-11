QUnit.module('Dropdown - Stopping event propagation');

var Dropdown = window.require('select2/dropdown');
var StopPropagation = window.require('select2/dropdown/stopPropagation');

var Options = window.require('select2/options');
var Utils = window.require('select2/utils');

var CustomDropdown = Utils.Decorate(Dropdown, StopPropagation);

var options = new Options();

QUnit.test('click event does not propagate', function (assert) {
  assert.expect(1);

  var containerElement = document.querySelector('#qunit-fixture .event-container');
  var container = new MockContainer();

  var dropdown = new CustomDropdown(document.querySelector('#qunit-fixture select'), options);

  var dropdownElement = dropdown.render();
  dropdown.bind(container, containerElement);

  containerElement.appendChild(dropdownElement);
  containerElement.addEventListener('click', function () {
    assert.ok(false, 'The click event should have been stopped');
  });

  var clickEvent = new Event('click', { bubbles: true, cancelable: true });
  dropdownElement.dispatchEvent(clickEvent);

  assert.ok(true, 'Something went wrong if this failed');
});
