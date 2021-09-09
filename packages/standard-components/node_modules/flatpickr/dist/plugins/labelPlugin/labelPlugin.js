(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.labelPlugin = factory());
}(this, (function () { 'use strict';

  function labelPlugin() {
      return function (fp) {
          return {
              onReady: function () {
                  var id = fp.input.id;
                  if (!id) {
                      return;
                  }
                  if (fp.mobileInput) {
                      fp.input.removeAttribute("id");
                      fp.mobileInput.id = id;
                  }
                  else if (fp.altInput) {
                      fp.input.removeAttribute("id");
                      fp.altInput.id = id;
                  }
                  fp.loadedPlugins.push("labelPlugin");
              },
          };
      };
  }

  return labelPlugin;

})));
