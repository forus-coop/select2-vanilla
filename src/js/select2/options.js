define([
  './defaults',
  './utils'
], function (Defaults, Utils) {
  function Options (options, element) {
    this.options = options;

    if (element != null) {
      this.fromElement(element);
    }

    if (element != null) {
      this.options = Defaults.applyFromElement(this.options, element);
    }

    this.options = Defaults.apply(this.options);
  }

  Options.prototype.fromElement = function (e) {
    var excludedData = ['select2'];

    if (this.options.multiple == null) {
      this.options.multiple = e.multiple;
    }

    if (this.options.disabled == null) {
      this.options.disabled = e.disabled;
    }

    if (this.options.autocomplete == null && e.autocomplete) {
      this.options.autocomplete = e.autocomplete;
    }

    if (this.options.dir == null) {
      if (e.dir) {
        this.options.dir = e.dir;
      } else if (e.closest('[dir]').dir) {
        this.options.dir = e.closest('[dir]').dir;
      } else {
        this.options.dir = 'ltr';
      }
    }

    e.disabled = this.options.disabled;
    e.multiple = this.options.multiple;

    if (Utils.GetData(e, 'select2Tags')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-select2-tags` attribute has been changed to ' +
          'use the `data-data` and `data-tags="true"` attributes and will be ' +
          'removed in future versions of Select2.'
        );
      }

      Utils.StoreData(e, 'data', Utils.GetData(e, 'select2Tags'));
      Utils.StoreData(e, 'tags', true);
    }

    if (Utils.GetData(e, 'ajaxUrl')) {
      if (this.options.debug && window.console && console.warn) {
        console.warn(
          'Select2: The `data-ajax-url` attribute has been changed to ' +
          '`data-ajax--url` and support for the old attribute will be removed' +
          ' in future versions of Select2.'
        );
      }

      e.setAttribute('ajax--url', Utils.GetData(e, 'ajaxUrl'));
      Utils.StoreData(e, 'ajax-Url', Utils.GetData(e, 'ajaxUrl'));
    }

    var dataset = {};

    function upperCaseLetter(_, letter) {
      return letter.toUpperCase();
    }

    // Pre-load all of the attributes which are prefixed with `data-`
    for (var attr = 0; attr < e.attributes.length; attr++) {
      var attributeName = e.attributes[attr].name;
      var prefix = 'data-';

      if (attributeName.substr(0, prefix.length) == prefix) {
        // Get the contents of the attribute after `data-`
        var dataName = attributeName.substring(prefix.length);

        // Get the data contents from the consistent source
        var dataValue = Utils.GetData(e, dataName);

        // camelCase the attribute name to match the spec
        var camelDataName = dataName.replace(/-([a-z])/g, upperCaseLetter);

        // Store the data attribute contents into the dataset since
        dataset[camelDataName] = dataValue;
      }
    }

    // Prefer the element's `dataset` attribute if it exists
    if (e.dataset) {
      dataset = Object.assign({}, e.dataset, dataset);
    }

    // Prefer our internal data cache if it exists
    var data = Object.assign({}, Utils.GetData(e), dataset);

    data = Utils._convertData(data);

    for (var key in data) {
      if (excludedData.indexOf(key) > -1) {
        continue;
      }

      if (typeof this.options[key] === 'object' && this.options[key] !== null) {
        Object.assign(this.options[key], data[key]);
      } else {
        this.options[key] = data[key];
      }
    }

    return this;
  };

  Options.prototype.get = function (key) {
    return this.options[key];
  };

  Options.prototype.set = function (key, val) {
    this.options[key] = val;
  };

  return Options;
});
