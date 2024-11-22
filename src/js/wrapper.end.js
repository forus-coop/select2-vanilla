  // Autoload the Select2 module
  // We know that all of the modules exist above this, so we're safe
  var select2 = S2.require('select2');

  // Return the Select2 instance for anyone who is importing it.
  return select2;
}));
