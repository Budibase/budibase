(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.sq = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Albanian = {
      weekdays: {
          shorthand: ["Di", "Hë", "Ma", "Më", "En", "Pr", "Sh"],
          longhand: [
              "E Diel",
              "E Hënë",
              "E Martë",
              "E Mërkurë",
              "E Enjte",
              "E Premte",
              "E Shtunë",
          ],
      },
      months: {
          shorthand: [
              "Jan",
              "Shk",
              "Mar",
              "Pri",
              "Maj",
              "Qer",
              "Kor",
              "Gus",
              "Sht",
              "Tet",
              "Nën",
              "Dhj",
          ],
          longhand: [
              "Janar",
              "Shkurt",
              "Mars",
              "Prill",
              "Maj",
              "Qershor",
              "Korrik",
              "Gusht",
              "Shtator",
              "Tetor",
              "Nëntor",
              "Dhjetor",
          ],
      },
      time_24hr: true,
  };
  fp.l10ns.sq = Albanian;
  var sq = fp.l10ns;

  exports.Albanian = Albanian;
  exports.default = sq;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
