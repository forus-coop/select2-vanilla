define(["../utils"], function (Utils) {
  function TagsSearchHighlight() {}

  TagsSearchHighlight.prototype.highlightFirstItem = function (decorated) {

    // Use querySelectorAll to find elements
    var options = this.results.querySelectorAll(
      ".select2-results__option--selectable:not(.select2-results__option--selected)"
    );
    if (options.length > 0) {
      var firstOption = options[0]; // Get the first element
      var data = Utils.GetData(firstOption, "data");
      var firstElement = data.element;

      if (firstElement && firstElement.getAttribute) {
        if (firstElement.getAttribute("data-select2-tag") === "true") {
          // Simulate mouseenter (rewrite the logic if necessary)
          var mouseEnterEvent = new MouseEvent("mouseenter", {
            bubbles: true,
            cancelable: true,
          });
          firstOption.dispatchEvent(mouseEnterEvent);

          return;
        }
      }
    }

    // Call the decorated method
    decorated.call(this);
  };

  return TagsSearchHighlight;
});
