define([], function () {
  function Tokenizer(decorated, element, options) {
    var tokenizer = options.get("tokenizer");

    if (tokenizer !== undefined) {
      this.tokenizer = tokenizer;
    }

    decorated.call(this, element, options);
  }

  Tokenizer.prototype.bind = function (
    decorated,
    container,
    containerElement
  ) {
    decorated.call(this, container, containerElement);

    this.searchElement =
      container.dropdown.searchElement ||
      container.selection.searchElement ||
      containerElement.querySelector(".select2-search__field");
  };

  Tokenizer.prototype.query = function (decorated, params, callback) {
    var self = this;

    function createAndSelect(data) {
      // Normalize the data object so we can use it for checks
      var item = self._normalizeItem(data);

      // Check if the data object already exists as a tag
      // Select it if it doesn't
      var existingOptions = Array.from(
        self.element.querySelectorAll("option")
      ).filter(function (option) {
        return option.value === item.id;
      });

      // If an existing option wasn't found for it, create the option
      if (existingOptions.length === 0) {
        var option = self.option(item);
        option.setAttribute("data-select2-tag", true);

        self._removeOldTags();
        self.addOptions([option]);
      }

      // Select the item, now that we know there is an option for it
      select(item);
    }

    function select(data) {
      self.trigger("select", {
        data: data,
      });
    }

    params.term = params.term || "";

    var tokenData = this.tokenizer(params, this.options, createAndSelect);

    if (tokenData.term !== params.term) {
      // Replace the search term if we have the search box
      if (this.searchElement) {
        this.searchElement.value = tokenData.term;
        this.searchElement.focus();
      }

      params.term = tokenData.term;
    }

    decorated.call(this, params, callback);
  };

  Tokenizer.prototype.tokenizer = function (_, params, options, callback) {
    var separators = options.get("tokenSeparators") || [];
    var term = params.term;
    var i = 0;

    var createTag =
      this.createTag ||
      function (params) {
        return {
          id: params.term,
          text: params.term,
        };
      };

    while (i < term.length) {
      var termChar = term[i];

      if (separators.indexOf(termChar) === -1) {
        i++;

        continue;
      }

      var part = term.substr(0, i);
      var partParams = Object.assign({}, params, {
        term: part,
      });

      var data = createTag(partParams);

      if (data == null) {
        i++;
        continue;
      }

      callback(data);

      // Reset the term to not include the tokenized portion
      term = term.substr(i + 1) || "";
      i = 0;
    }

    return {
      term: term,
    };
  };

  return Tokenizer;
});
