(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.km = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Khmer = {
      weekdays: {
          shorthand: ["អាទិត្យ", "ចន្ទ", "អង្គារ", "ពុធ", "ព្រហស.", "សុក្រ", "សៅរ៍"],
          longhand: [
              "អាទិត្យ",
              "ចន្ទ",
              "អង្គារ",
              "ពុធ",
              "ព្រហស្បតិ៍",
              "សុក្រ",
              "សៅរ៍",
          ],
      },
      months: {
          shorthand: [
              "មករា",
              "កុម្ភះ",
              "មីនា",
              "មេសា",
              "ឧសភា",
              "មិថុនា",
              "កក្កដា",
              "សីហា",
              "កញ្ញា",
              "តុលា",
              "វិច្ឆិកា",
              "ធ្នូ",
          ],
          longhand: [
              "មករា",
              "កុម្ភះ",
              "មីនា",
              "មេសា",
              "ឧសភា",
              "មិថុនា",
              "កក្កដា",
              "សីហា",
              "កញ្ញា",
              "តុលា",
              "វិច្ឆិកា",
              "ធ្នូ",
          ],
      },
      ordinal: function () {
          return "";
      },
      firstDayOfWeek: 1,
      rangeSeparator: " ដល់ ",
      weekAbbreviation: "សប្តាហ៍",
      scrollTitle: "រំកិលដើម្បីបង្កើន",
      toggleTitle: "ចុចដើម្បីផ្លាស់ប្ដូរ",
      yearAriaLabel: "ឆ្នាំ",
      time_24hr: true,
  };
  fp.l10ns.km = Khmer;
  var km = fp.l10ns;

  exports.Khmer = Khmer;
  exports.default = km;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
