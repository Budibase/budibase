(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ka = {}));
}(this, (function (exports) { 'use strict';

  var fp = typeof window !== "undefined" && window.flatpickr !== undefined
      ? window.flatpickr
      : {
          l10ns: {},
      };
  var Georgian = {
      weekdays: {
          shorthand: ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"],
          longhand: [
              "კვირა",
              "ორშაბათი",
              "სამშაბათი",
              "ოთხშაბათი",
              "ხუთშაბათი",
              "პარასკევი",
              "შაბათი",
          ],
      },
      months: {
          shorthand: [
              "იან",
              "თებ",
              "მარ",
              "აპრ",
              "მაი",
              "ივნ",
              "ივლ",
              "აგვ",
              "სექ",
              "ოქტ",
              "ნოე",
              "დეკ",
          ],
          longhand: [
              "იანვარი",
              "თებერვალი",
              "მარტი",
              "აპრილი",
              "მაისი",
              "ივნისი",
              "ივლისი",
              "აგვისტო",
              "სექტემბერი",
              "ოქტომბერი",
              "ნოემბერი",
              "დეკემბერი",
          ],
      },
      firstDayOfWeek: 1,
      ordinal: function () {
          return "";
      },
      rangeSeparator: " — ",
      weekAbbreviation: "კვ.",
      scrollTitle: "დასქროლეთ გასადიდებლად",
      toggleTitle: "დააკლიკეთ გადართვისთვის",
      amPM: ["AM", "PM"],
      yearAriaLabel: "წელი",
      time_24hr: true,
  };
  fp.l10ns.ka = Georgian;
  var ka = fp.l10ns;

  exports.Georgian = Georgian;
  exports.default = ka;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
