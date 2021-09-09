(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.momentPlugin = factory());
}(this, (function () { 'use strict';

  function getEventTarget(event) {
      try {
          if (typeof event.composedPath === "function") {
              var path = event.composedPath();
              return path[0];
          }
          return event.target;
      }
      catch (error) {
          return event.target;
      }
  }

  function momentPlugin(config) {
      var moment = config.moment;
      return function (fp) {
          function captureIncrement(e) {
              var event = e;
              event.stopPropagation();
              var date = moment(fp.selectedDates[0]);
              var input = getEventTarget(event);
              var unit = Array.from(input.classList)
                  .filter(function (name) { return name.startsWith("flatpickr-"); })
                  .map(function (name) { return name.substring(10); })[0];
              var step = parseFloat(input.getAttribute("step"));
              date.add(step * event.delta, unit);
              fp.setDate(date.toDate());
          }
          return {
              parseDate: function (datestr, format) {
                  return moment(datestr, format, true).toDate();
              },
              formatDate: function (date, format) {
                  // locale can also be used
                  var momentDate = moment(date);
                  if (typeof fp.config.locale === "string") {
                      momentDate.locale(fp.config.locale);
                  }
                  return momentDate.format(format);
              },
              onReady: function () {
                  [fp.hourElement, fp.minuteElement, fp.secondElement].forEach(function (element) {
                      return element &&
                          element.addEventListener("increment", captureIncrement, {
                              capture: true,
                          });
                  });
              },
              onDestroy: function () {
                  [fp.hourElement, fp.minuteElement, fp.secondElement].forEach(function (element) {
                      return element &&
                          element.removeEventListener("increment", captureIncrement, {
                              capture: true,
                          });
                  });
              },
          };
      };
  }

  return momentPlugin;

})));
