define([
  '../utils',
  '../keys'
], function (Utils, KEYS) {
  function BaseSelection (element, options) {
    this.element = element;
    this.options = options;

    BaseSelection.__super__.constructor.call(this);
  }

  Utils.Extend(BaseSelection, Utils.Observable);

  BaseSelection.prototype.render = function () {
    var selection = document.createElement('span');
    selection.className = 'select2-selection';
    selection.setAttribute('role', 'combobox');
    selection.setAttribute('aria-haspopup', 'true');
    selection.setAttribute('aria-expanded', 'false');

    this._tabindex = 0;

    if (Utils.GetData(this.element, 'old-tabindex') != null) {
      this._tabindex = Utils.GetData(this.element, 'old-tabindex');
    } else if (this.element.getAttribute('tabindex') != null) {
      this._tabindex = this.element.getAttribute('tabindex');
    }

    selection.setAttribute('title', this.element.getAttribute('title'));
    selection.setAttribute('tabindex', this._tabindex);
    selection.setAttribute('aria-disabled', 'false');

    this.selection = selection;

    return selection;
  };

  BaseSelection.prototype.bind = function (container, containerElement) {
    var self = this;

    var resultsId = container.id + '-results';

    this.container = container;

    this.selection.addEventListener('focus', function (evt) {
      self.trigger('focus', evt);
    });

    this.selection.addEventListener('blur', function (evt) {
      self._handleBlur(evt);
    });

    this.selection.addEventListener('keydown', function (evt) {
      self.trigger('keypress', evt);

      if (evt.which === KEYS.SPACE) {
        evt.preventDefault();
      }
    });

    container.on('results:focus', function (params) {
      self.selection.setAttribute('aria-activedescendant', params.data._resultId);
    });

    container.on('selection:update', function (params) {
      self.update(params.data);
    });

    container.on('open', function () {
      // When the dropdown is open, aria-expanded="true"
      self.selection.setAttribute('aria-expanded', 'true');
      self.selection.setAttribute('aria-owns', resultsId);

      self._attachCloseHandler(container);
    });

    container.on('close', function () {
      // When the dropdown is closed, aria-expanded="false"
      self.selection.setAttribute('aria-expanded', 'false');
      self.selection.removeAttribute('aria-activedescendant');
      self.selection.removeAttribute('aria-owns');

      self.selection.focus();

      self._detachCloseHandler(container);
    });

    container.on('enable', function () {
      self.selection.setAttribute('tabindex', self._tabindex);
      self.selection.setAttribute('aria-disabled', 'false');
    });

    container.on('disable', function () {
      self.selection.setAttribute('tabindex', '-1');
      self.selection.setAttribute('aria-disabled', 'true');
    });
  };

  BaseSelection.prototype._handleBlur = function (evt) {
    var self = this;

    // This needs to be delayed as the active element is the body when the tab
    // key is pressed, possibly along with others.
    window.setTimeout(function () {
      // Don't trigger `blur` if the focus is still in the selection
      if (
        (document.activeElement == self.selection) ||
        (self.selection.contains(document.activeElement))
      ) {
        return;
      }

      self.trigger('blur', evt);
    }, 1);
  };

  BaseSelection.prototype._attachCloseHandler = function (container) {
    document.body.addEventListener('mousedown', function (e) {
      var target = e.target;

      var select = target.closest('.select2');

      var all = document.querySelectorAll('.select2.select2-container--open');

      all.forEach(function (element) {
        if (element == select) {
          return;
        }

        var elementData = Utils.GetData(element, 'element');

        elementData.select2('close');
      });
    });
  };

  BaseSelection.prototype._detachCloseHandler = function (container) {
    document.body.removeEventListener('mousedown', function (e) {
      // No-op function to match the signature of addEventListener
    });
  };

  BaseSelection.prototype.position = function (selection, containerElement) {
    var selectionContainer = containerElement.querySelector('.selection');
    selectionContainer.appendChild(selection);
  };

  BaseSelection.prototype.destroy = function () {
    this._detachCloseHandler(this.container);
  };

  BaseSelection.prototype.update = function (data) {
    throw new Error('The `update` method must be defined in child classes.');
  };

  /**
   * Helper method to abstract the "enabled" (not "disabled") state of this
   * object.
   *
   * @return {true} if the instance is not disabled.
   * @return {false} if the instance is disabled.
   */
  BaseSelection.prototype.isEnabled = function () {
    return !this.isDisabled();
  };

  /**
   * Helper method to abstract the "disabled" state of this object.
   *
   * @return {true} if the disabled option is true.
   * @return {false} if the disabled option is false.
   */
  BaseSelection.prototype.isDisabled = function () {
    return this.options.get('disabled');
  };

  return BaseSelection;
});
