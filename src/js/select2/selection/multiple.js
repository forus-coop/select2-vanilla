define([
  './base',
  '../utils'
], function (BaseSelection, Utils) {
  function MultipleSelection ($element, options) {
    MultipleSelection.__super__.constructor.apply(this, arguments);
  }

  Utils.Extend(MultipleSelection, BaseSelection);

  MultipleSelection.prototype.render = function () {
    var $selection = MultipleSelection.__super__.render.call(this);

    $selection[0].classList.add('select2-selection--multiple');

    $selection.innerHTML =
      '<ul class="select2-selection__rendered"></ul>';

    return $selection;
  };

  MultipleSelection.prototype.bind = function (container, $container) {
    var self = this;

    MultipleSelection.__super__.bind.apply(this, arguments);

    var id = container.id + '-container';
    this.$selection.querySelector('.select2-selection__rendered').setAttribute('id', id);

    this.$selection.addEventListener('click', function (evt) {
      self.trigger('toggle', {
        originalEvent: evt
      });
    });

    this.$selection.addEventListener(
      'click',
      function (evt) {
        if (evt.target.classList.contains('select2-selection__choice__remove')) {
          // Ignore the event if it is disabled
          if (self.isDisabled()) {
            return;
          }

          var $remove = evt.target;
          var $selection = $remove.parentElement;

          var data = Utils.GetData($selection, 'data');

          self.trigger('unselect', {
            originalEvent: evt,
            data: data
          });
        }
      }
    );

    this.$selection.addEventListener(
      'keydown',
      function (evt) {
        if (evt.target.classList.contains('select2-selection__choice__remove')) {
          // Ignore the event if it is disabled
          if (self.isDisabled()) {
            return;
          }

          evt.stopPropagation();
        }
      }
    );
  };

  MultipleSelection.prototype.clear = function () {
    var $rendered = this.$selection.querySelector('.select2-selection__rendered');
    $rendered.innerHTML = '';
    $rendered.removeAttribute('title');
  };

  MultipleSelection.prototype.display = function (data, container) {
    var template = this.options.get('templateSelection');
    var escapeMarkup = this.options.get('escapeMarkup');

    return escapeMarkup(template(data, container));
  };

  MultipleSelection.prototype.selectionContainer = function () {
    var $container = document.createElement('li');
    $container.classList.add('select2-selection__choice');

    var $button = document.createElement('button');
    $button.type = 'button';
    $button.classList.add('select2-selection__choice__remove');
    $button.tabIndex = -1;
    $button.innerHTML = '<span aria-hidden="true">&times;</span>';

    var $span = document.createElement('span');
    $span.classList.add('select2-selection__choice__display');

    $container.appendChild($button);
    $container.appendChild($span);

    return $container;
  };

  MultipleSelection.prototype.update = function (data) {
    this.clear();

    if (data.length === 0) {
      return;
    }

    var $selections = [];

    var selectionIdPrefix = this.$selection.querySelector('.select2-selection__rendered')
      .getAttribute('id') + '-choice-';

    for (var d = 0; d < data.length; d++) {
      var selection = data[d];

      var $selection = this.selectionContainer();
      var formatted = this.display(selection, $selection);

      var selectionId = selectionIdPrefix + Utils.generateChars(4) + '-';

      if (selection.id) {
        selectionId += selection.id;
      } else {
        selectionId += Utils.generateChars(4);
      }

      $selection.querySelector('.select2-selection__choice__display')
        .appendChild(document.createTextNode(formatted))
        .setAttribute('id', selectionId);

      var title = selection.title || selection.text;

      if (title) {
        $selection.setAttribute('title', title);
      }

      var removeItem = this.options.get('translations').get('removeItem');

      var $remove = $selection.querySelector('.select2-selection__choice__remove');

      $remove.setAttribute('title', removeItem());
      $remove.setAttribute('aria-label', removeItem());
      $remove.setAttribute('aria-describedby', selectionId);

      Utils.StoreData($selection, 'data', selection);

      $selections.push($selection);
    }

    var $rendered = this.$selection.querySelector('.select2-selection__rendered');

    $rendered.append(...$selections);
  };

  return MultipleSelection;
});
