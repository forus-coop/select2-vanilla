define(function () {
  function Search() {}

  Search.prototype.render = function (decorated) {
    var rendered = decorated.call(this);
    var searchLabel = this.options.get("translations").get("search");

    var search = document.createElement("span");
    search.className = "select2-search select2-search--dropdown";
    search.innerHTML =
      '<input class="select2-search__field" type="search" tabindex="-1"' +
      ' autocorrect="off" autocapitalize="none"' +
      ' spellcheck="false" role="searchbox" aria-autocomplete="list" />';

    this.searchContainer = search;
    this.search = search.querySelector("input");

    this.search.setAttribute(
      "autocomplete",
      this.options.get("autocomplete")
    );
    this.search.setAttribute("aria-label", searchLabel());

    rendered.insertBefore(search, rendered.firstChild);

    return rendered;
  };

  Search.prototype.bind = function (
    decorated,
    container,
    containerElement
  ) {
    var self = this;

    var resultsId = container.id + "-results";

    decorated.call(this, container, containerElement);

    this.search.addEventListener("keydown", function (evt) {
      self.trigger("keypress", evt);

      self.keyUpPrevented = evt.defaultPrevented;
    });

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.search.addEventListener("input", function (evt) {
      // Unbind the duplicated `keyup` event
      this.removeEventListener("keyup", arguments.callee);
    });

    this.search.addEventListener("keyup", function (evt) {
      self.handleSearch(evt);
    });

    this.search.addEventListener("input", function (evt) {
      self.handleSearch(evt);
    });

    container.on("open", function () {
      self.search.setAttribute("tabindex", 0);
      self.search.setAttribute("aria-controls", resultsId);

      self.search.focus();

      window.setTimeout(function () {
        self.search.focus();
      }, 0);
    });

    container.on("close", function () {
      self.search.setAttribute("tabindex", -1);
      self.search.removeAttribute("aria-controls");
      self.search.removeAttribute("aria-activedescendant");

      self.search.value = "";
      self.search.blur();
    });

    container.on("focus", function () {
      if (!container.isOpen()) {
        self.search.focus();
      }
    });

    container.on("results:all", function (params) {
      if (params.query.term == null || params.query.term === "") {
        var showSearch = self.showSearch(params);

        if (showSearch) {
          self.searchContainer.classList.remove("select2-search--hide");
        } else {
          self.searchContainer.classList.add("select2-search--hide");
        }
      }
    });

    container.on("results:focus", function (params) {
      if (params.data._resultId) {
        self.search.setAttribute(
          "aria-activedescendant",
          params.data._resultId
        );
      } else {
        self.search.removeAttribute("aria-activedescendant");
      }
    });
  };

  Search.prototype.handleSearch = function (evt) {
    if (!this.keyUpPrevented) {
      var input = this.search.value;

      this.trigger("query", {
        term: input,
      });
    }

    this.keyUpPrevented = false;
  };

  Search.prototype.showSearch = function (_, params) {
    return true;
  };

  return Search;
});
