  // Return the AMD loader configuration so it can be used outside of this file
  window.require = S2.require;
  window.define = S2.define;
  return {
    define: S2.define,
    require: S2.require
  };
}());
