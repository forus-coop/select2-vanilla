define([], function () {
  function StopPropagation() {}

  StopPropagation.prototype.bind = function (decorated, container, $container) {
    decorated.call(this, container, $container);

    var stoppedEvents = [
      "blur",
      "change",
      "click",
      "dblclick",
      "focus",
      "focusin",
      "focusout",
      "input",
      "keydown",
      "keyup",
      "keypress",
      "mousedown",
      "mouseenter",
      "mouseleave",
      "mousemove",
      "mouseover",
      "mouseup",
      "search",
      "touchend",
      "touchstart",
    ];

    stoppedEvents.forEach((event) => {
      this.dropdown.addEventListener(event, function (evt) {
        evt.stopPropagation();
      });
    });
  };

  return StopPropagation;
});
