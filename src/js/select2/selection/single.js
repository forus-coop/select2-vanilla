define([
  './base',
  '../utils',
  '../keys'
], function (BaseSelection, Utils, KEYS) {
  function SingleSelection () {
    SingleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(SingleSelection, BaseSelection);

  SingleSelection.prototype.render = function () {
    var selection = SingleSelection.__super__.render.call(this);

    selection.classList.add('select2-selection--single');

    selection.innerHTML =
      '<span class="select2-selection__rendered"></span>' +
      '<span class="select2-selection__arrow" role="presentation">' +
        '<b role="presentation"></b>' +
      '</span>';

    return selection;
  };

  SingleSelection.prototype.bind = function (container, containerElement) {
    var self = this;

    SingleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';

    var rendered = this.selection.querySelector('.select2-selection__rendered');
    rendered.setAttribute('id', id);
    rendered.setAttribute('role', 'textbox');
    rendered.setAttribute('aria-readonly', 'true');
    this.selection.setAttribute('aria-labelledby', id);
    this.selection.setAttribute('aria-controls', id);

    this.selection.addEventListener('mousedown', function (evt) {
      // Only respond to left clicks
      if (evt.which !== 1) {
        return;
      }

      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.selection.addEventListener('focus', function (evt) {
      // User focuses on the container
    });

    this.selection.addEventListener('blur', function (evt) {
      // User exits the container
    });

    container.on('focus', function (evt) {
      if (!container.isOpen()) {
        self.selection.focus();
      }
    });
  };

  SingleSelection.prototype.clear = function () {
    var rendered = this.selection.querySelector('.select2-selection__rendered');
    rendered.innerHTML = '';
    rendered.removeAttribute('title'); // clear tooltip on empty
  };

  SingleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  SingleSelection.prototype.selectionContainer = function () {
    var container = document.createElement('span');
    return container;
  };

  SingleSelection.prototype.update = function (data) {
    if (data.length === 0) {
      this.clear();
      return;
    }

    var selection = data[0];

    var rendered = this.selection.querySelector('.select2-selection__rendered');
    var formatted = this.display(selection, rendered);

    rendered.innerHTML = formatted;

    var title = selection.title || selection.text;

    if (title) {
      rendered.setAttribute('title', title);
    } else {
      rendered.removeAttribute('title');
    }
  };

  return SingleSelection;
});
