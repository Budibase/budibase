(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.scrollPlugin = factory());
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

  if (typeof window.CustomEvent !== "function") {
      function CustomEvent(typeArg, eventInitDict) {
          eventInitDict = eventInitDict || {
              bubbles: false,
              cancelable: false,
              detail: undefined,
          };
          var evt = document.createEvent("CustomEvent");
          evt.initCustomEvent(typeArg, eventInitDict.bubbles, eventInitDict.cancelable, eventInitDict.detail);
          return evt;
      }
      CustomEvent.prototype = window.Event.prototype;
      window.CustomEvent = CustomEvent;
  }
  function delta(e) {
      return Math.max(-1, Math.min(1, e.wheelDelta || -e.deltaY));
  }
  var scroll = function (e) {
      e.preventDefault();
      var ev = new CustomEvent("increment", {
          bubbles: true,
      });
      ev.delta = delta(e);
      getEventTarget(e).dispatchEvent(ev);
  };
  function scrollMonth(fp) {
      return function (e) {
          e.preventDefault();
          var mDelta = delta(e);
          fp.changeMonth(mDelta);
      };
  }
  function scrollPlugin() {
      return function (fp) {
          var monthScroller = scrollMonth(fp);
          return {
              onReady: function () {
                  if (fp.timeContainer) {
                      fp.timeContainer.addEventListener("wheel", scroll);
                  }
                  fp.yearElements.forEach(function (yearElem) {
                      return yearElem.addEventListener("wheel", scroll);
                  });
                  fp.monthElements.forEach(function (monthElem) {
                      return monthElem.addEventListener("wheel", monthScroller);
                  });
                  fp.loadedPlugins.push("scroll");
              },
              onDestroy: function () {
                  if (fp.timeContainer) {
                      fp.timeContainer.removeEventListener("wheel", scroll);
                  }
                  fp.yearElements.forEach(function (yearElem) {
                      return yearElem.removeEventListener("wheel", scroll);
                  });
                  fp.monthElements.forEach(function (monthElem) {
                      return monthElem.removeEventListener("wheel", monthScroller);
                  });
              },
          };
      };
  }

  return scrollPlugin;

})));
