(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.gr = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Greek = {
      weekdays: {
          shorthand: ["Κυ", "Δε", "Τρ", "Τε", "Πέ", "Πα", "Σά"],
          longhand: [
              "Κυριακή",
              "Δευτέρα",
              "Τρίτη",
              "Τετάρτη",
              "Πέμπτη",
              "Παρασκευή",
              "Σάββατο",
          ],
      },
      months: {
          shorthand: [
              "Ιαν",
              "Φεβ",
              "Μάρ",
              "Απρ",
              "Μάι",
              "Ιού",
              "Ιού",
              "Αύγ",
              "Σεπ",
              "Οκτ",
              "Νοέ",
              "Δεκ",
          ],
          longhand: [
              "Ιανουάριος",
              "Φεβρουάριος",
              "Μάρτιος",
              "Απρίλιος",
              "Μάιος",
              "Ιούνιος",
              "Ιούλιος",
              "Αύγουστος",
              "Σεπτέμβριος",
              "Οκτώβριος",
              "Νοέμβριος",
              "Δεκέμβριος",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return "";
      },
      weekAbbreviation: "Εβδ",
      rangeSeparator: " έως ",
      scrollTitle: "Μετακυλήστε για προσαύξηση",
      toggleTitle: "Κάντε κλικ για αλλαγή",
      amPM: ["ΠΜ", "ΜΜ"],
  };
  fp.l10ns.gr = Greek;
  var gr = fp.l10ns;

  exports.Greek = Greek;
  exports.default = gr;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
