(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.weekSelect = factory());
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

  function weekSelectPlugin() {
      return function (fp) {
          function onDayHover(event) {
              var day = getEventTarget(event);
              if (!day.classList.contains("flatpickr-day"))
                  return;
              var days = fp.days.childNodes;
              var dayIndex = day.$i;
              var dayIndSeven = dayIndex / 7;
              var weekStartDay = days[7 * Math.floor(dayIndSeven)]
                  .dateObj;
              var weekEndDay = days[7 * Math.ceil(dayIndSeven + 0.01) - 1].dateObj;
              for (var i = days.length; i--;) {
                  var day_1 = days[i];
                  var date = day_1.dateObj;
                  if (date > weekEndDay || date < weekStartDay)
                      day_1.classList.remove("inRange");
                  else
                      day_1.classList.add("inRange");
              }
          }
          function highlightWeek() {
              var selDate = fp.latestSelectedDateObj;
              if (selDate !== undefined &&
                  selDate.getMonth() === fp.currentMonth &&
                  selDate.getFullYear() === fp.currentYear) {
                  fp.weekStartDay = fp.days.childNodes[7 * Math.floor(fp.selectedDateElem.$i / 7)].dateObj;
                  fp.weekEndDay = fp.days.childNodes[7 * Math.ceil(fp.selectedDateElem.$i / 7 + 0.01) - 1].dateObj;
              }
              var days = fp.days.childNodes;
              for (var i = days.length; i--;) {
                  var date = days[i].dateObj;
                  if (date >= fp.weekStartDay && date <= fp.weekEndDay)
                      days[i].classList.add("week", "selected");
              }
          }
          function clearHover() {
              var days = fp.days.childNodes;
              for (var i = days.length; i--;)
                  days[i].classList.remove("inRange");
          }
          function onReady() {
              if (fp.daysContainer !== undefined)
                  fp.daysContainer.addEventListener("mouseover", onDayHover);
          }
          function onDestroy() {
              if (fp.daysContainer !== undefined)
                  fp.daysContainer.removeEventListener("mouseover", onDayHover);
          }
          return {
              onValueUpdate: highlightWeek,
              onMonthChange: highlightWeek,
              onYearChange: highlightWeek,
              onOpen: highlightWeek,
              onClose: clearHover,
              onParseConfig: function () {
                  fp.config.mode = "single";
                  fp.config.enableTime = false;
                  fp.config.dateFormat = fp.config.dateFormat
                      ? fp.config.dateFormat
                      : "\\W\\e\\e\\k #W, Y";
                  fp.config.altFormat = fp.config.altFormat
                      ? fp.config.altFormat
                      : "\\W\\e\\e\\k #W, Y";
              },
              onReady: [
                  onReady,
                  highlightWeek,
                  function () {
                      fp.loadedPlugins.push("weekSelect");
                  },
              ],
              onDestroy: onDestroy,
          };
      };
  }

  return weekSelectPlugin;

})));
