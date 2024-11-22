define([
  '../utils',
  '../keys'
], function (Utils, KEYS) {
  function Search (decorated, element, options) {
    decorated.call(this, element, options);
  }

  Search.prototype.render = function (decorated) {
    var searchLabel = this.options.get('translations').get('search');
    var search = document.createElement('span');
    search.className = 'select2-search select2-search--inline';
    search.innerHTML = '<textarea class="select2-search__field" type="search" tabindex="-1"' +
      ' autocorrect="off" autocapitalize="none"' +
      ' spellcheck="false" role="searchbox" aria-autocomplete="list"></textarea>';

    this.searchContainer = search;
    this.search = search.querySelector('textarea');

    this.search.setAttribute('autocomplete', this.options.get('autocomplete'));
    this.search.setAttribute('aria-label', searchLabel());

    var rendered = decorated.call(this);

    this._transferTabIndex();
    rendered.appendChild(this.searchContainer);

    return rendered;
  };

  Search.prototype.bind = function (decorated, container, containerElement) {
    var self = this;

    var resultsId = container.id + '-results';
    var selectionId = container.id + '-container';

    decorated.call(this, container, containerElement);

    self.search.setAttribute('aria-describedby', selectionId);

    container.on('open', function () {
      self.search.setAttribute('aria-controls', resultsId);
      self.search.focus();
    });

    container.on('close', function () {
      self.search.value = '';
      self.resizeSearch();
      self.search.removeAttribute('aria-controls');
      self.search.removeAttribute('aria-activedescendant');
      self.search.blur();
    });

    container.on('enable', function () {
      self.search.disabled = false;

      self._transferTabIndex();
    });

    container.on('disable', function () {
      self.search.disabled = true;
    });

    container.on('focus', function (evt) {
      self.search.focus();
    });

    container.on('results:focus', function (params) {
      if (params.data._resultId) {
        self.search.setAttribute('aria-activedescendant', params.data._resultId);
      } else {
        self.search.removeAttribute('aria-activedescendant');
      }
    });

    this.selection.addEventListener('focusin', function (evt) {
      if (evt.target.classList.contains('select2-search--inline')) {
        self.trigger('focus', evt);
      }
    });

    this.selection.addEventListener('focusout', function (evt) {
      if (evt.target.classList.contains('select2-search--inline')) {
        self._handleBlur(evt);
      }
    });

    this.selection.addEventListener('keydown', function (evt) {
      if (evt.target.classList.contains('select2-search--inline')) {
        evt.stopPropagation();

        self.trigger('keypress', evt);

        self._keyUpPrevented = evt.defaultPrevented;

        var key = evt.which;

        if (key === KEYS.BACKSPACE && self.search.value === '') {
          var previousChoice = self.selection.querySelectorAll('.select2-selection__choice');
          previousChoice = previousChoice[previousChoice.length - 1];

          if (previousChoice) {
            var item = Utils.GetData(previousChoice, 'data');

            self.searchRemoveChoice(item);

            evt.preventDefault();
          }
        }
      }
    });

    this.selection.addEventListener('click', function (evt) {
      if (evt.target.classList.contains('select2-search--inline') && self.search.value) {
        evt.stopPropagation();
      }
    });

    // Try to detect the IE version should the `documentMode` property that
    // is stored on the document. This is only implemented in IE and is
    // slightly cleaner than doing a user agent check.
    // This property is not available in Edge, but Edge also doesn't have
    // this bug.
    var msie = document.documentMode;
    var disableInputEvents = msie && msie <= 11;

    // Workaround for browsers which do not support the `input` event
    // This will prevent double-triggering of events for browsers which support
    // both the `keyup` and `input` events.
    this.selection.addEventListener('input', function (evt) {
      if (evt.target.classList.contains('select2-search--inline')) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents) {
          self.selection.removeEventListener('input', arguments.callee);
          self.selection.removeEventListener('input', arguments.callee);
          return;
        }

        // Unbind the duplicated `keyup` event
        self.selection.removeEventListener('keyup', arguments.callee);
      }
    });

    this.selection.addEventListener('keyup', function (evt) {
      if (evt.target.classList.contains('select2-search--inline')) {
        // IE will trigger the `input` event when a placeholder is used on a
        // search box. To get around this issue, we are forced to ignore all
        // `input` events in IE and keep using `keyup`.
        if (disableInputEvents && evt.type === 'input') {
          self.selection.removeEventListener('input', arguments.callee);
          self.selection.removeEventListener('input', arguments.callee);
          return;
        }

        var key = evt.which;

        // We can freely ignore events from modifier keys
        if (key == KEYS.SHIFT || key == KEYS.CTRL || key == KEYS.ALT) {
          return;
        }

        // Tabbing will be handled during the `keydown` phase
        if (key == KEYS.TAB) {
          return;
        }

        self.handleSearch(evt);
      }
    });
  };

  /**
   * This method will transfer the tabindex attribute from the rendered
   * selection to the search box. This allows for the search box to be used as
   * the primary focus instead of the selection container.
   *
   * @private
   */
  Search.prototype._transferTabIndex = function (decorated) {
    this.search.setAttribute('tabindex', this.selection.getAttribute('tabindex'));
    this.selection.setAttribute('tabindex', '-1');
  };

  Search.prototype.createPlaceholder = function (decorated, placeholder) {
    this.search.setAttribute('placeholder', placeholder.text);
  };

  Search.prototype.update = function (decorated, data) {
    var searchHadFocus = this.search == document.activeElement;

    this.search.setAttribute('placeholder', '');

    decorated.call(this, data);

    this.resizeSearch();
    if (searchHadFocus) {
      this.search.focus();
    }
  };

  Search.prototype.handleSearch = function () {
    this.resizeSearch();

    if (!this._keyUpPrevented) {
      var input = this.search.value;

      this.trigger('query', {
        term: input
      });
    }

    this._keyUpPrevented = false;
  };

  Search.prototype.searchRemoveChoice = function (decorated, item) {
    this.trigger('unselect', {
      data: item
    });

    this.search.value = item.text;
    this.handleSearch();
  };

  Search.prototype.resizeSearch = function () {
    this.search.style.width = '25px';

    var width = '100%';

    if (this.search.getAttribute('placeholder') === '') {
      var minimumWidth = this.search.value.length + 1;

      width = (minimumWidth * 0.75) + 'em';
    }

    this.search.style.width = width;
  };

  return Search;
});
