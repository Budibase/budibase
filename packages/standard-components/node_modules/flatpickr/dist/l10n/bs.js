(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bs = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Bosnian = {
      firstDayOfWeek: 1,
      weekdays: {
          shorthand: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
          longhand: [
              "Nedjelja",
              "Ponedjeljak",
              "Utorak",
              "Srijeda",
              "Četvrtak",
              "Petak",
              "Subota",
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
              "Avg",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
          ],
          longhand: [
              "Januar",
              "Februar",
              "Mart",
              "April",
              "Maj",
              "Juni",
              "Juli",
              "Avgust",
              "Septembar",
              "Oktobar",
              "Novembar",
              "Decembar",
          ],
      },
      time_24hr: true,
  };
  fp.l10ns.bs = Bosnian;
  var bs = fp.l10ns;

  exports.Bosnian = Bosnian;
  exports.default = bs;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
