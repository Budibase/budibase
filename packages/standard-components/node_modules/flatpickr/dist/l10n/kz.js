(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.kz = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Kazakh = {
      weekdays: {
          shorthand: ["Жс", "Дс", "Сc", "Ср", "Бс", "Жм", "Сб"],
          longhand: [
              "Жексенбi",
              "Дүйсенбi",
              "Сейсенбi",
              "Сәрсенбi",
              "Бейсенбi",
              "Жұма",
              "Сенбi",
          ],
      },
      months: {
          shorthand: [
              "Қаң",
              "Ақп",
              "Нау",
              "Сәу",
              "Мам",
              "Мау",
              "Шiл",
              "Там",
              "Қыр",
              "Қаз",
              "Қар",
              "Жел",
          ],
          longhand: [
              "Қаңтар",
              "Ақпан",
              "Наурыз",
              "Сәуiр",
              "Мамыр",
              "Маусым",
              "Шiлде",
              "Тамыз",
              "Қыркүйек",
              "Қазан",
              "Қараша",
              "Желтоқсан",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return "";
      },
      rangeSeparator: " — ",
      weekAbbreviation: "Апта",
      scrollTitle: "Үлкейту үшін айналдырыңыз",
      toggleTitle: "Ауыстыру үшін басыңыз",
      amPM: ["ТД", "ТК"],
      yearAriaLabel: "Жыл",
  };
  fp.l10ns.kz = Kazakh;
  var kz = fp.l10ns;

  exports.Kazakh = Kazakh;
  exports.default = kz;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
