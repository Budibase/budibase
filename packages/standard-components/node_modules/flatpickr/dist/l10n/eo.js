(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.eo = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Esperanto = {
      firstDayOfWeek: 1,
      rangeSeparator: " ĝis ",
      weekAbbreviation: "Sem",
      scrollTitle: "Rulumu por pligrandigi la valoron",
      toggleTitle: "Klaku por ŝalti",
      weekdays: {
          shorthand: ["Dim", "Lun", "Mar", "Mer", "Ĵaŭ", "Ven", "Sab"],
          longhand: [
              "dimanĉo",
              "lundo",
              "mardo",
              "merkredo",
              "ĵaŭdo",
              "vendredo",
              "sabato",
          ],
      },
      months: {
          shorthand: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Maj",
              "Jun",
              "Jul",
              "Aŭg",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
          ],
          longhand: [
              "januaro",
              "februaro",
              "marto",
              "aprilo",
              "majo",
              "junio",
              "julio",
              "aŭgusto",
              "septembro",
              "oktobro",
              "novembro",
              "decembro",
          ],
      },
      ordinal: function () {
          return "-a";
      },
      time_24hr: true,
  };
  fp.l10ns.eo = Esperanto;
  var eo = fp.l10ns;

  exports.Esperanto = Esperanto;
  exports.default = eo;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
