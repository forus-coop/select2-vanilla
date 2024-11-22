define([
  '../keys',
  '../utils'
], function (KEYS, Utils) {
  function AllowClear () { }

  AllowClear.prototype.bind = function (decorated, container, containerElement) {
    var self = this;

    decorated.call(this, container, containerElement);

    if (this.placeholder == null) {
      if (this.options.get('debug') && window.console && console.error) {
        console.error(
          'Select2: The `allowClear` option should be used in combination ' +
          'with the `placeholder` option.'
        );
      }
    }

    this.selection.addEventListener('mousedown', function (evt) {
      if (evt.target.classList.contains('select2-selection__clear')) {
        self._handleClear(evt);
      }
    });

    container.on('keypress', function (evt) {
      self._handleKeyboardClear(evt, container);
    });
  };

  AllowClear.prototype._handleClear = function (_, evt) {
    // Ignore the event if it is disabled
    if (this.isDisabled()) {
      return;
    }

    var clear = this.selection.querySelector('.select2-selection__clear');

    // Ignore the event if nothing has been selected
    if (!clear) {
      return;
    }

    evt.stopPropagation();

    var data = Utils.GetData(clear, 'data');

    var previousVal = this.element.value;
    this.element.value = this.placeholder.id;

    var unselectData = {
      data: data
    };
    this.trigger('clear', unselectData);
    if (unselectData.prevented) {
      this.element.value = previousVal;
      return;
    }

    for (var d = 0; d < data.length; d++) {
      unselectData = {
        data: data[d]
      };

      // Trigger the `unselect` event, so people can prevent it from being
      // cleared.
      this.trigger('unselect', unselectData);

      // If the event was prevented, don't clear it out.
      if (unselectData.prevented) {
        this.element.value = previousVal;
        return;
      }
    }

    this.element.dispatchEvent(new Event('input'));
    this.element.dispatchEvent(new Event('change'));

    this.trigger('toggle', {});
  };

  AllowClear.prototype._handleKeyboardClear = function (_, evt, container) {
    if (container.isOpen()) {
      return;
    }

    if (evt.which == KEYS.DELETE || evt.which == KEYS.BACKSPACE) {
      this._handleClear(evt);
    }
  };

  AllowClear.prototype.update = function (decorated, data) {
    decorated.call(this, data);

    var clear = this.selection.querySelector('.select2-selection__clear');
    if (clear) {
      clear.remove();
    }
    this.selection.classList.remove('select2-selection--clearable');

    if (this.selection.querySelector('.select2-selection__placeholder') ||
        data.length === 0) {
      return;
    }

    var selectionId = this.selection.querySelector('.select2-selection__rendered')
      .getAttribute('id');

    var removeAll = this.options.get('translations').get('removeAllItems');

    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'select2-selection__clear';
    remove.tabIndex = -1;
    remove.innerHTML = '<span aria-hidden="true">&times;</span>';
    remove.title = removeAll();
    remove.setAttribute('aria-label', removeAll());
    remove.setAttribute('aria-describedby', selectionId);
    Utils.StoreData(remove, 'data', data);

    this.selection.insertBefore(remove, this.selection.firstChild);
    this.selection.classList.add('select2-selection--clearable');
  };

  return AllowClear;
});
