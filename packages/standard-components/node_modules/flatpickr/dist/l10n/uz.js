(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.uz = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Uzbek = {
      weekdays: {
          shorthand: ["Якш", "Душ", "Сеш", "Чор", "Пай", "Жум", "Шан"],
          longhand: [
              "Якшанба",
              "Душанба",
              "Сешанба",
              "Чоршанба",
              "Пайшанба",
              "Жума",
              "Шанба",
          ],
      },
      months: {
          shorthand: [
              "Янв",
              "Фев",
              "Мар",
              "Апр",
              "Май",
              "Июн",
              "Июл",
              "Авг",
              "Сен",
              "Окт",
              "Ноя",
              "Дек",
          ],
          longhand: [
              "Январ",
              "Феврал",
              "Март",
              "Апрел",
              "Май",
              "Июн",
              "Июл",
              "Август",
              "Сентябр",
              "Октябр",
              "Ноябр",
              "Декабр",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return "";
      },
      rangeSeparator: " — ",
      weekAbbreviation: "Ҳафта",
      scrollTitle: "Катталаштириш учун айлантиринг",
      toggleTitle: "Ўтиш учун босинг",
      amPM: ["AM", "PM"],
      yearAriaLabel: "Йил",
      time_24hr: true,
  };
  fp.l10ns.uz = Uzbek;
  var uz = fp.l10ns;

  exports.Uzbek = Uzbek;
  exports.default = uz;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
