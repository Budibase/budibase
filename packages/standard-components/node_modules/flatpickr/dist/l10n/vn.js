(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vn = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Vietnamese = {
      weekdays: {
          shorthand: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
          longhand: [
              "Chủ nhật",
              "Thứ hai",
              "Thứ ba",
              "Thứ tư",
              "Thứ năm",
              "Thứ sáu",
              "Thứ bảy",
          ],
      },
      months: {
          shorthand: [
              "Th1",
              "Th2",
              "Th3",
              "Th4",
              "Th5",
              "Th6",
              "Th7",
              "Th8",
              "Th9",
              "Th10",
              "Th11",
              "Th12",
          ],
          longhand: [
              "Tháng một",
              "Tháng hai",
              "Tháng ba",
              "Tháng tư",
              "Tháng năm",
              "Tháng sáu",
              "Tháng bảy",
              "Tháng tám",
              "Tháng chín",
              "Tháng mười",
              "Tháng mười một",
              "Tháng mười hai",
          ],
      },
      firstDayOfWeek: 1,
      rangeSeparator: " đến ",
  };
  fp.l10ns.vn = Vietnamese;
  var vn = fp.l10ns;

  exports.Vietnamese = Vietnamese;
  exports.default = vn;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
