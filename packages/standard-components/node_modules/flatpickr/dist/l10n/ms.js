(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ms = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Malaysian = {
      weekdays: {
          shorthand: ["Min", "Isn", "Sel", "Rab", "Kha", "Jum", "Sab"],
          longhand: [
              "Minggu",
              "Isnin",
              "Selasa",
              "Rabu",
              "Khamis",
              "Jumaat",
              "Sabtu",
          ],
      },
      months: {
          shorthand: [
              "Jan",
              "Feb",
              "Mac",
              "Apr",
              "Mei",
              "Jun",
              "Jul",
              "Ogo",
              "Sep",
              "Okt",
              "Nov",
              "Dis",
          ],
          longhand: [
              "Januari",
              "Februari",
              "Mac",
              "April",
              "Mei",
              "Jun",
              "Julai",
              "Ogos",
              "September",
              "Oktober",
              "November",
              "Disember",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return "";
      },
  };
  var ms = fp.l10ns;

  exports.Malaysian = Malaysian;
  exports.default = ms;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
