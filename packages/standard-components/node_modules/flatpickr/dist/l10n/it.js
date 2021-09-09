(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.it = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Italian = {
      weekdays: {
          shorthand: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
          longhand: [
              "Domenica",
              "Lunedì",
              "Martedì",
              "Mercoledì",
              "Giovedì",
              "Venerdì",
              "Sabato",
          ],
      },
      months: {
          shorthand: [
              "Gen",
              "Feb",
              "Mar",
              "Apr",
              "Mag",
              "Giu",
              "Lug",
              "Ago",
              "Set",
              "Ott",
              "Nov",
              "Dic",
          ],
          longhand: [
              "Gennaio",
              "Febbraio",
              "Marzo",
              "Aprile",
              "Maggio",
              "Giugno",
              "Luglio",
              "Agosto",
              "Settembre",
              "Ottobre",
              "Novembre",
              "Dicembre",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () { return "°"; },
      rangeSeparator: " al ",
      weekAbbreviation: "Se",
      scrollTitle: "Scrolla per aumentare",
      toggleTitle: "Clicca per cambiare",
      time_24hr: true,
  };
  fp.l10ns.it = Italian;
  var it = fp.l10ns;

  exports.Italian = Italian;
  exports.default = it;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
