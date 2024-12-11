define([
  './utils'
], function (Utils) {
  function Dropdown(element, options) {
    this.element = element;
    this.options = options;

    Dropdown.__super__.constructor.call(this);
  }

  Utils.Extend(Dropdown, Utils.Observable);

  Dropdown.prototype.render = function () {
    var dropdown = document.createElement("span");
    dropdown.className = "select2-dropdown";
    dropdown.innerHTML = '<span class="select2-results"></span>';

    dropdown.setAttribute("dir", this.options.get("dir"));

    this.dropdown = dropdown;

    return dropdown;
  };

  Dropdown.prototype.bind = function () {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.position = function (dropdown, container) {
    // Should be implemented in subclasses
  };

  Dropdown.prototype.destroy = function () {
    // Remove the dropdown from the DOM
    this.dropdown.remove();
  };

  return Dropdown;
});
