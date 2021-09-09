(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fi = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Finnish = {
      firstDayOfWeek: 1,
      weekdays: {
          shorthand: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
          longhand: [
              "Sunnuntai",
              "Maanantai",
              "Tiistai",
              "Keskiviikko",
              "Torstai",
              "Perjantai",
              "Lauantai",
          ],
      },
      months: {
          shorthand: [
              "Tammi",
              "Helmi",
              "Maalis",
              "Huhti",
              "Touko",
              "Kesä",
              "Heinä",
              "Elo",
              "Syys",
              "Loka",
              "Marras",
              "Joulu",
          ],
          longhand: [
              "Tammikuu",
              "Helmikuu",
              "Maaliskuu",
              "Huhtikuu",
              "Toukokuu",
              "Kesäkuu",
              "Heinäkuu",
              "Elokuu",
              "Syyskuu",
              "Lokakuu",
              "Marraskuu",
              "Joulukuu",
          ],
      },
      ordinal: function () {
          return ".";
      },
      time_24hr: true,
  };
  fp.l10ns.fi = Finnish;
  var fi = fp.l10ns;

  exports.Finnish = Finnish;
  exports.default = fi;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
