define(["./select", "../utils"], function (SelectAdapter, Utils) {
  function ArrayAdapter($element, options) {
    this._dataToConvert = options.get("data") || [];

    ArrayAdapter.__super__.constructor.call(this, $element, options);
  }

  Utils.Extend(ArrayAdapter, SelectAdapter);

  ArrayAdapter.prototype.bind = function (container, $container) {
    ArrayAdapter.__super__.bind.call(this, container, $container);

    this.addOptions(this.convertToOptions(this._dataToConvert));
  };

  ArrayAdapter.prototype.select = function (data) {
    var self = this;

    // Convert NodeList to array
    var options = Array.prototype.slice.call(this.element.querySelectorAll('option'));

    var option = options.filter(function (option) {
      return option.value == data.id.toString();
    });

    if (option.length === 0) {
      var option = this.option(data);
      this.element.appendChild(option);
    }

    option[0].selected = true;
  };

  ArrayAdapter.prototype.convertToOptions = function (data) {
    var self = this;

    var $existing = this.element.querySelectorAll("option");
    var existingIds = Array.from($existing).map(function (option) {
      return self.item(option).id;
    });

    var $options = [];

    // Filter out all items except for the one passed in the argument
    function onlyItem(item) {
      return function (option) {
        return option.value == item.id;
      };
    }

    for (var d = 0; d < data.length; d++) {
      var item = this._normalizeItem(data[d]);

      // Skip items which were pre-loaded, only merge the data
      if (existingIds.indexOf(item.id) >= 0) {
        var $existingOption = Array.from($existing).filter(
          onlyItem(item)
        );

        var existingData = this.item($existingOption);
        var newData = Object.assign({}, item, existingData);

        var $newOption = this.option(newData);

        $existingOption.replaceWith($newOption);

        continue;
      }

      var $option = this.option(item);

      if (item.children) {
        var $children = this.convertToOptions(item.children);

        $option.append($children);
      }

      $options.push($option);
    }

    return $options;
  };

  return ArrayAdapter;
});
