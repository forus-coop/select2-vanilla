define(function () {
  function EventRelay () { }

  EventRelay.prototype.bind = function (decorated, container, containerElement) {
    var self = this;
    var relayEvents = [
      'open', 'opening',
      'close', 'closing',
      'select', 'selecting',
      'unselect', 'unselecting',
      'clear', 'clearing'
    ];

    var preventableEvents = [
      'opening', 'closing', 'selecting', 'unselecting', 'clearing'
    ];

    decorated.call(this, container, containerElement);

    container.on('*', function (name, params) {
      // Ignore events that should not be relayed
      if (relayEvents.indexOf(name) === -1) {
        return;
      }

      // The parameters should always be an object
      params = params || {};

      // Generate the custom event for the Select2 event
      var evt = new CustomEvent('select2:' + name, {
        detail: {
          params: params
        },
        bubbles: true,
        cancelable: true
      });

      self.element.dispatchEvent(evt);

      // Only handle preventable events if it was one
      if (preventableEvents.indexOf(name) === -1) {
        return;
      }

      params.prevented = evt.defaultPrevented;
    });
  };

  return EventRelay;
});
