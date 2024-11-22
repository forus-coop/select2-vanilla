(function () {
  // Restore the Select2 AMD loader so it can be used
  // Needed mostly in the language files, where the loader is not inserted
  if (window.S2) {
    var S2 = window.S2;
  }
