(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.az = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Azerbaijan = {
      weekdays: {
          shorthand: ["B.", "B.e.", "Ç.a.", "Ç.", "C.a.", "C.", "Ş."],
          longhand: [
              "Bazar",
              "Bazar ertəsi",
              "Çərşənbə axşamı",
              "Çərşənbə",
              "Cümə axşamı",
              "Cümə",
              "Şənbə",
          ],
      },
      months: {
          shorthand: [
              "Yan",
              "Fev",
              "Mar",
              "Apr",
              "May",
              "İyn",
              "İyl",
              "Avq",
              "Sen",
              "Okt",
              "Noy",
              "Dek",
          ],
          longhand: [
              "Yanvar",
              "Fevral",
              "Mart",
              "Aprel",
              "May",
              "İyun",
              "İyul",
              "Avqust",
              "Sentyabr",
              "Oktyabr",
              "Noyabr",
              "Dekabr",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return ".";
      },
      rangeSeparator: " - ",
      weekAbbreviation: "Hf",
      scrollTitle: "Artırmaq üçün sürüşdürün",
      toggleTitle: "Aç / Bağla",
      amPM: ["GƏ", "GS"],
      time_24hr: true,
  };
  fp.l10ns.az = Azerbaijan;
  var az = fp.l10ns;

  exports.Azerbaijan = Azerbaijan;
  exports.default = az;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
