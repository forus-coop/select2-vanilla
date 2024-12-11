define([
  './options',
  './utils',
  './keys'
], function (Options, Utils, KEYS) {
  var Select2 = function (element, options) {
    if (Utils.GetData(element, "select2") != null) {
      Utils.GetData(element, "select2").destroy();
    }

    this.element = element;

    this.id = this._generateId(element);

    options = options || {};

    this.options = new Options(options, element);

    Select2.__super__.constructor.call(this);

    // Set up the tabindex

    var tabindex = element.getAttribute("tabindex") || 0;
    Utils.StoreData(element, "old-tabindex", tabindex);
    element.setAttribute("tabindex", "-1");

    // Set up containers and adapters

    var DataAdapter = this.options.get("dataAdapter");
    this.dataAdapter = new DataAdapter(element, this.options);

    var container = this.render();

    this._placeContainer(container);

    var SelectionAdapter = this.options.get("selectionAdapter");
    this.selection = new SelectionAdapter(element, this.options);
    this.selectionElement = this.selection.render();

    this.selection.position(this.selectionElement, container);

    var DropdownAdapter = this.options.get("dropdownAdapter");
    this.dropdown = new DropdownAdapter(element, this.options);
    this.dropdownElement = this.dropdown.render();

    this.dropdown.position(this.dropdownElement, container);

    var ResultsAdapter = this.options.get("resultsAdapter");
    this.results = new ResultsAdapter(
      element,
      this.options,
      this.dataAdapter
    );
    this.resultsElement = this.results.render();

    this.results.position(this.resultsElement, this.dropdownElement);

    // Bind events

    var self = this;

    // Bind the container to all of the adapters
    this._bindAdapters();

    // Register any DOM event handlers
    this._registerDomEvents();

    // Register any internal event handlers
    this._registerDataEvents();
    this._registerSelectionEvents();
    this._registerDropdownEvents();
    this._registerResultsEvents();
    this._registerEvents();

    // Set the initial state
    this.dataAdapter.current(function (initialData) {
      self.trigger("selection:update", {
        data: initialData,
      });
    });

    // Hide the original select
    element.classList.add("select2-hidden-accessible");
    element.setAttribute("aria-hidden", "true");

    // Synchronize any monitored attributes
    this._syncAttributes();

    Utils.StoreData(element, "select2", this);

    // Ensure backwards compatibility with element.data('select2').
    element.select2 = this;
    element.insertAdjacentElement("afterend", container);
  };

  Utils.Extend(Select2, Utils.Observable);

  Select2.prototype._generateId = function (element) {
    var id = "";

    if (element.getAttribute("id") != null) {
      id = element.getAttribute("id");
    } else if (element.getAttribute("name") != null) {
      id = element.getAttribute("name") + "-" + Utils.generateChars(2);
    } else {
      id = Utils.generateChars(4);
    }

    id = id.replace(/(:|\.|\[|\]|,)/g, "");
    id = "select2-" + id;

    return id;
  };

  Select2.prototype._placeContainer = function (container) {
    container.insertAdjacentElement("afterend", this.element);

    var width = this._resolveWidth(
      this.element,
      this.options.get("width")
    );

    if (width != null) {
      container.style.width = width;
    }
  };

  Select2.prototype._resolveWidth = function (element, method) {
    var WIDTH =
      /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;

    if (method == "resolve") {
      var styleWidth = this._resolveWidth(element, "style");

      if (styleWidth != null) {
        return styleWidth;
      }

      return this._resolveWidth(element, "element");
    }

    if (method == "element") {
      var elementWidth = element.offsetWidth;

      if (elementWidth <= 0) {
        return "auto";
      }

      return elementWidth + "px";
    }

    if (method == "style") {
      var style = element.getAttribute("style");

      if (typeof style !== "string") {
        return null;
      }

      var attrs = style.split(";");

      for (var i = 0, l = attrs.length; i < l; i = i + 1) {
        var attr = attrs[i].replace(/\s/g, "");
        var matches = attr.match(WIDTH);

        if (matches !== null && matches.length >= 1) {
          return matches[1];
        }
      }

      return null;
    }

    if (method == "computedstyle") {
      var computedStyle = window.getComputedStyle(element);

      return computedStyle.width;
    }

    return method;
  };

  Select2.prototype._bindAdapters = function () {
    this.dataAdapter.bind(this, this.container);
    this.selection.bind(this, this.container);

    this.dropdown.bind(this, this.container);
    this.results.bind(this, this.container);
  };

  Select2.prototype._registerDomEvents = function () {
    var self = this;

    this.element.addEventListener("change", function () {
      self.dataAdapter.current(function (data) {
        self.trigger("selection:update", {
          data: data,
        });
      });
    });

    this.element.addEventListener("focus", function (evt) {
      self.trigger("focus", evt);
    });

    this._syncA = Utils.bind(this._syncAttributes, this);
    this._syncS = Utils.bind(this._syncSubtree, this);

    this._observer = new window.MutationObserver(function (mutations) {
      self._syncA();
      self._syncS(mutations);
    });
    this._observer.observe(this.element, {
      attributes: true,
      childList: true,
      subtree: false,
    });
  };

  Select2.prototype._registerDataEvents = function () {
    var self = this;

    this.dataAdapter.on("*", function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerSelectionEvents = function () {
    var self = this;
    var nonRelayEvents = ["toggle", "focus"];

    this.selection.on("toggle", function () {
      self.toggleDropdown();
    });

    this.selection.on("focus", function (params) {
      self.focus(params);
    });

    this.selection.on("*", function (name, params) {
      if (nonRelayEvents.indexOf(name) !== -1) {
        return;
      }

      self.trigger(name, params);
    });
  };

  Select2.prototype._registerDropdownEvents = function () {
    var self = this;

    this.dropdown.on("*", function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerResultsEvents = function () {
    var self = this;

    this.results.on("*", function (name, params) {
      self.trigger(name, params);
    });
  };

  Select2.prototype._registerEvents = function () {
    var self = this;

    this.on("open", function () {
      self.container.classList.add("select2-container--open");
    });

    this.on("close", function () {
      self.container.classList.remove("select2-container--open");
    });

    this.on("enable", function () {
      self.container.classList.remove("select2-container--disabled");
    });

    this.on("disable", function () {
      self.container.classList.add("select2-container--disabled");
    });

    this.on("blur", function () {
      self.container.classList.remove("select2-container--focus");
    });

    this.on("query", function (params) {
      if (!self.isOpen()) {
        self.trigger("open", {});
      }

      this.dataAdapter.query(params, function (data) {
        self.trigger("results:all", {
          data: data,
          query: params,
        });
      });
    });

    this.on("query:append", function (params) {
      this.dataAdapter.query(params, function (data) {
        self.trigger("results:append", {
          data: data,
          query: params,
        });
      });
    });

    this.on("keypress", function (evt) {
      var key = evt.which;

      if (self.isOpen()) {
        if (key === KEYS.ESC || (key === KEYS.UP && evt.altKey)) {
          self.close(evt);

          evt.preventDefault();
        } else if (key === KEYS.ENTER || key === KEYS.TAB) {
          self.trigger("results:select", {});

          evt.preventDefault();
        } else if (key === KEYS.SPACE && evt.ctrlKey) {
          self.trigger("results:toggle", {});

          evt.preventDefault();
        } else if (key === KEYS.UP) {
          self.trigger("results:previous", {});

          evt.preventDefault();
        } else if (key === KEYS.DOWN) {
          self.trigger("results:next", {});

          evt.preventDefault();
        }
      } else {
        if (
          key === KEYS.ENTER ||
          key === KEYS.SPACE ||
          (key === KEYS.DOWN && evt.altKey)
        ) {
          self.open();

          evt.preventDefault();
        }
      }
    });
  };

  Select2.prototype._syncAttributes = function () {
    this.options.set("disabled", this.element.disabled);

    if (this.isDisabled()) {
      if (this.isOpen()) {
        this.close();
      }

      this.trigger("disable", {});
    } else {
      this.trigger("enable", {});
    }
  };

  Select2.prototype._isChangeMutation = function (mutations) {
    var self = this;

    if (mutations.addedNodes && mutations.addedNodes.length > 0) {
      for (var n = 0; n < mutations.addedNodes.length; n++) {
        var node = mutations.addedNodes[n];

        if (node.selected) {
          return true;
        }
      }
    } else if (
      mutations.removedNodes &&
      mutations.removedNodes.length > 0
    ) {
      return true;
    } else if (Array.isArray(mutations)) {
      return mutations.some(function (mutation) {
        return self._isChangeMutation(mutation);
      });
    }

    return false;
  };

  Select2.prototype._syncSubtree = function (mutations) {
    var changed = this._isChangeMutation(mutations);
    var self = this;

    // Only re-pull the data if we think there is a change
    if (changed) {
      this.dataAdapter.current(function (currentData) {
        self.trigger("selection:update", {
          data: currentData,
        });
      });
    }
  };

  /**
   * Override the trigger method to automatically trigger pre-events when
   * there are events that can be prevented.
   */
  Select2.prototype.trigger = function (name, args) {
    var actualTrigger = Select2.__super__.trigger;
    var preTriggerMap = {
      open: "opening",
      close: "closing",
      select: "selecting",
      unselect: "unselecting",
      clear: "clearing",
    };

    if (args === undefined) {
      args = {};
    }

    if (name in preTriggerMap) {
      var preTriggerName = preTriggerMap[name];
      var preTriggerArgs = {
        prevented: false,
        name: name,
        args: args,
      };

      actualTrigger.call(this, preTriggerName, preTriggerArgs);

      if (preTriggerArgs.prevented) {
        args.prevented = true;

        return;
      }
    }

    actualTrigger.call(this, name, args);
  };

  Select2.prototype.toggleDropdown = function () {
    if (this.isDisabled()) {
      return;
    }

    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  };

  Select2.prototype.open = function () {
    if (this.isOpen()) {
      return;
    }

    if (this.isDisabled()) {
      return;
    }

    this.trigger("query", {});
  };

  Select2.prototype.close = function (evt) {
    if (!this.isOpen()) {
      return;
    }

    this.trigger("close", { originalEvent: evt });
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  Select2.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  Select2.prototype.isDisabled = function () {
    return this.options.get("disabled");
  };

  Select2.prototype.isOpen = function () {
    return this.container.classList.contains("select2-container--open");
  };

  Select2.prototype.hasFocus = function () {
    return this.container.classList.contains("select2-container--focus");
  };

  Select2.prototype.focus = function (data) {
    // No need to re-trigger focus events if we are already focused
    if (this.hasFocus()) {
      return;
    }

    this.container.classList.add("select2-container--focus");
    this.trigger("focus", {});
  };

  Select2.prototype.enable = function (args) {
    if (this.options.get("debug") && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("enable")` method has been deprecated and will' +
          " be removed in later Select2 versions. Use element.disabled" +
          " instead."
      );
    }

    if (args == null || args.length === 0) {
      args = [true];
    }

    var disabled = !args[0];

    this.element.disabled = disabled;
  };

  Select2.prototype.data = function () {
    if (
      this.options.get("debug") &&
      arguments.length > 0 &&
      window.console &&
      console.warn
    ) {
      console.warn(
        'Select2: Data can no longer be set using `select2("data")`. You ' +
          "should consider setting the value instead using `element.value`."
      );
    }

    var data = [];

    this.dataAdapter.current(function (currentData) {
      data = currentData;
    });

    return data;
  };

  Select2.prototype.val = function (args) {
    if (this.options.get("debug") && window.console && console.warn) {
      console.warn(
        'Select2: The `select2("val")` method has been deprecated and will be' +
          " removed in later Select2 versions. Use element.value instead."
      );
    }
    if (args == null || args.length === 0) {
      return Array.from(this.element.selectedOptions).map((option) => option.value)
    }

    var newVal = args[0];

    if (Array.isArray(newVal)) {
      newVal = newVal.map(function (obj) {
        return obj.toString();
      });
    }

    this.element.value = newVal;
    this.element.dispatchEvent(new Event("input"));
    this.element.dispatchEvent(new Event("change"));
  };

  Select2.prototype.destroy = function () {
    Utils.RemoveData(this.container);
    this.container.remove();

    this._observer.disconnect();
    this._observer = null;

    this._syncA = null;
    this._syncS = null;

    this.element.removeEventListener("change", this._syncA);
    this.element.removeEventListener("focus", this._syncS);
    this.element.setAttribute(
      "tabindex",
      Utils.GetData(this.element, "old-tabindex")
    );

    this.element.classList.remove("select2-hidden-accessible");
    this.element.setAttribute("aria-hidden", "false");
    Utils.RemoveData(this.element);
    delete this.element.select2;

    this.dataAdapter.destroy();
    this.selection.destroy();
    this.dropdown.destroy();
    this.results.destroy();

    this.dataAdapter = null;
    this.selection = null;
    this.dropdown = null;
    this.results = null;
  };

  Select2.prototype.render = function () {
    var container = document.createElement("span");
    container.className = "select2 select2-container";
    container.innerHTML =
      '<span class="selection"></span>' +
      '<span class="dropdown-wrapper" aria-hidden="true"></span>';

    container.setAttribute("dir", this.options.get("dir"));

    this.container = container;

    this.container.classList.add(
      "select2-container--" + this.options.get("theme")
    );

    Utils.StoreData(container, "element", this.element);

    return container;
  };

  return Select2;
});
