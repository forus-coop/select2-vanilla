define([
  './select2/core',
  './select2/defaults',
  './select2/utils'
], function (Select2, Defaults, Utils) {
  if (typeof window.Select2 === "undefined") {
    window.Select2 = Select2;
  }

  if (typeof window.Select2.defaults === "undefined") {
    window.Select2.defaults = Defaults;
  }

  if (typeof window.Select2.Utils === "undefined") {
    window.Select2.Utils = Utils;
  }

  if (typeof window.Select2.fn === "undefined") {
    window.Select2.fn = {};
  }

  if (typeof window.Select2.fn.select2 === "undefined") {
    window.Select2.fn.select2 = function (options) {
      options = options || {};

      if (typeof options === "object") {
        this.each(function () {
          var instanceOptions = Object.assign({}, options);

          var instance = new Select2(this, instanceOptions);
        });

        return this;
      } else if (typeof options === "string") {
        var ret;
        var args = Array.prototype.slice.call(arguments, 1);

        this.each(function () {
          var instance = Utils.GetData(this, "select2");

          if (instance == null && window.console && console.error) {
            console.error(
              "The select2('" +
                options +
                "') method was called on an " +
                "element that is not using Select2."
            );
          }

          ret = instance[options].apply(instance, args);
        });

        // Check if we should be returning `this`
        if (["open", "close", "destroy"].indexOf(options) > -1) {
          return this;
        }

        return ret;
      } else {
        throw new Error("Invalid arguments for Select2: " + options);
      }
    };
  }

  return Select2;
});
