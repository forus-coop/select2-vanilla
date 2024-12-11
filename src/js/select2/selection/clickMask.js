define(function () {
  function ClickMask () { }

  ClickMask.prototype.bind = function (decorate, container, containerElement) {
    var self = this;

    decorate.call(this, container, containerElement);

    this.mask = document.createElement('div');
    this.mask.className = 'select2-close-mask';

    this.mask.addEventListener('mousedown', function () {
      self.trigger('close', {});
    });

    this.mask.addEventListener('touchstart', function () {
      self.trigger('close', {});
    });

    this.mask.addEventListener('click', function () {
      self.trigger('close', {});
    });
  };

  ClickMask.prototype._attachCloseHandler = function (decorate, container) {
    document.body.appendChild(this.mask);
  };

  ClickMask.prototype._detachCloseHandler = function (decorate, container) {
    this.mask.remove();
  };

  return ClickMask;
});
