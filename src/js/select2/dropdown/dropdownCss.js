define(["../utils"], function (Utils) {
  function DropdownCSS() {}

  DropdownCSS.prototype.render = function (decorated) {
    var $dropdown = decorated.call(this);

    var dropdownCssClass = this.options.get("dropdownCssClass") || "";

    if (dropdownCssClass.indexOf(":all:") !== -1) {
      dropdownCssClass = dropdownCssClass.replace(":all:", "");

      Utils.copyNonInternalCssClasses($dropdown, this.element);
    }

    dropdownCssClass
      .trim()
      .split(" ")
      .forEach(function (cssClass) {
        if (cssClass.length > 0) {
          $dropdown.classList.add(cssClass);
        }
      });

    return $dropdown;
  };

  return DropdownCSS;
});
