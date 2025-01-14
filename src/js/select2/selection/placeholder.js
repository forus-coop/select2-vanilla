define([], function () {
  function Placeholder(decorated, $element, options) {
    this.placeholder = this.normalizePlaceholder(
      options.get("placeholder")
    );

    decorated.call(this, $element, options);
  }

  Placeholder.prototype.normalizePlaceholder = function (_, placeholder) {
    if (typeof placeholder === "string") {
      placeholder = {
        id: "",
        text: placeholder,
      };
    }

    return placeholder;
  };

  Placeholder.prototype.createPlaceholder = function (
    decorated,
    placeholder
  ) {
    var $placeholder = this.selectionContainer();

    $placeholder.innerHTML = this.display(placeholder);
    $placeholder.classList.add("select2-selection__placeholder");
    $placeholder.classList.remove("select2-selection__choice");

    var placeholderTitle =
      placeholder.title || placeholder // || $placeholder.text();

    this.selection
      .querySelector(".select2-selection__rendered")
      .setAttribute("title", placeholderTitle);

    return $placeholder;
  };

  Placeholder.prototype.update = function (decorated, data) {
    var singlePlaceholder =
      data.length == 1 && data[0].id != this.placeholder.id;
    var multipleSelections = data.length > 1;

    if (multipleSelections || singlePlaceholder) {
      return decorated.call(this, data);
    }

    this.clear();

    var $placeholder = this.createPlaceholder(this.placeholder);

    // Use querySelector to find the `.select2-selection__rendered` element
    var renderedElement = this.selection.querySelector(".select2-selection__rendered");
    if (renderedElement) {
      renderedElement.appendChild($placeholder);
    }
  };

  return Placeholder;
});
