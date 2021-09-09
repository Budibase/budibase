(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.uk = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Ukrainian = {
      firstDayOfWeek: 1,
      weekdays: {
          shorthand: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          longhand: [
              "Неділя",
              "Понеділок",
              "Вівторок",
              "Середа",
              "Четвер",
              "П'ятниця",
              "Субота",
          ],
      },
      months: {
          shorthand: [
              "Січ",
              "Лют",
              "Бер",
              "Кві",
              "Тра",
              "Чер",
              "Лип",
              "Сер",
              "Вер",
              "Жов",
              "Лис",
              "Гру",
          ],
          longhand: [
              "Січень",
              "Лютий",
              "Березень",
              "Квітень",
              "Травень",
              "Червень",
              "Липень",
              "Серпень",
              "Вересень",
              "Жовтень",
              "Листопад",
              "Грудень",
          ],
      },
      time_24hr: true,
  };
  fp.l10ns.uk = Ukrainian;
  var uk = fp.l10ns;

  exports.Ukrainian = Ukrainian;
  exports.default = uk;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
